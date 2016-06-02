'use strict';

// DEPENDENCIES
var bluebird   = require('bluebird');
var fs         = require('fs-extra');
var path       = require('path');
var _          = require('lodash');
var uslug      = require('uslug');
var uuid       = require('node-uuid');
var archiver   = require('archiver');
var renderFile = bluebird.promisify(require('pug').renderFile);

// Is there an easier way to get the version of the module? This will do, for now.
var pkgJSON = require('../package.json');
var version = pkgJSON.name + ' v' + pkgJSON.version;

// Default options
var defaultOptions = {
	author: ['anonymous'],
	publisher: 'anonymous',
	appendChapterTitles: false,
	dates: {
		published: new Date().toISOString().split('.')[0]+ 'Z',
		modified: new Date().toISOString().split('.')[0]+ 'Z'
	},
	lang: 'en',
	generator: version
};

// Creates a valid epub 3.0.1 document, saved to file.
function createFile(options, templates) {
	return new bluebird(function(resolve, reject){
		// TODO: Check if bare minimum passed & handle errors.
		// TODO: Find new template engine.
		// TODO: Cover + Title Page.
		// TODO: Error handling.

		// Combine default options with passed options.
		options = _.assign(defaultOptions, options);

		// Assign book with unique UUID identifier.
		options.id = uuid.v4();

		// Process contents for use by templates.
		processContents(options);

		// TODO: Parse images, grab & save.

		// Generate metadata & chapters, then generate the epub.
		bluebird.all([
			generateMetadata(options, templates),
			generateChapters(options.contents)
		]).then(function([contentDocs, chapters]){
			if (!options.output) {
				options.output = path.resolve(__dirname, '../tempDir/' + options.id + '.epub');
				console.log('No output defined. Location of ebook: ' + options.output);
			}

			// Create output stream to a file.
			// Note: fs-extra generates directories if they are not present, and will overwrite the file.
			fs.ensureFileSync(options.output); // This needs removing. Adding it to above bluebird.all won't work.

			var output = fs.createWriteStream(options.output);

			// Create zip archive for epub file.
			var book = archiver('zip', {zlib: {level: 9}});	// 9 (optimal compression)

			// EVENT EMITTER LISTENERS
			// SUCCESS
			// Once output is closed, the epub is finalized and the promise resolves.
			output.on('close', function(){
				resolve();
			});

			// ERRORS
			// Reject promise if error occurs during file generation.
			output.on('error', function(err){
				reject(err);
			});

			book.on('error', function(err){
				reject(err);
			});

			// Pipe archive to file stream.
			book.pipe(output);

			// Add metadata/structure to zip file.
			book
			.append(contentDocs.mimetype, {name: 'mimetype', store: true})
			.append(contentDocs.containerXML, {name: 'META-INF/container.xml'})
			.append(contentDocs.styleCSS, {name: 'EPUB/css/style.css'})
			.append(contentDocs.tocNCX, {name: 'EPUB/xhtml/toc.ncx'})
			.append(contentDocs.tocXHTML, {name: 'EPUB/xhtml/toc.xhtml'})
			.append(contentDocs.packageOPF, {name: 'EPUB/package.opf'});

			// Add chapters to zip file.
			for (var i = 0; i < options.contents.length; i++) {
				book.append(chapters[i], {name: '/EPUB/xhtml/' + options.contents[i].fileName});
			}

			// Everything done? Close the stream.
			// Note: According to archiver docs, end/close/finish events will fire once this is called.
			book.finalize();
		}).catch(function(error){
			reject(error);
		});
	});
}

// Generates all chapters
function generateChapters(chapters) {
	return bluebird.map(chapters, function(chapter) {
		return renderFile(path.resolve(__dirname, 'templates', 'chapter.xhtml.pug'), chapter);
	});
}

// Generates all metadata files
function generateMetadata(options, templates) {
	return new bluebird(function(resolve, reject){
		// Object to return
		var metadata = {
			mimetype: 'application/epub+zip',
			containerXML: '<?xml version="1.0" encoding="utf-8" ?><container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0"><rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
			styleCSS: '.epub-author{color:#555}.epub-link{margin-bottom:30px}.epub-link a{color:#666;font-size:90%}.toc-author{font-size:90%;color:#555}.toc-link{color:#999;font-size:85%;display:block}hr{border:0;border-bottom:1px solid #dedede;margin:60px 10%}',
		};

		// Template paths
		var pathPackageOPF = path.resolve(__dirname, 'templates', 'package.opf.pug');
		var pathTocNCX = path.resolve(__dirname, 'templates', 'toc.ncx.pug');
		var pathTocXHTML = path.resolve(__dirname, 'templates', 'toc.xhtml.pug');


		// TODO: Determine whether or not custom templates should be used
		/* package.opf example
		if (_.has(templates, 'customOPF') && !_.isEmpty(templates.customOPF)){
			pathPackageOPF = templates.customOPF;
		}*/

		/*
			Custom Templates:
				package.opf
				toc.ncx
				toc.xhtml
				style.css
		*/

		// Generate dynamic metadata files
		bluebird.all([
			renderFile(pathPackageOPF, options),
			renderFile(pathTocNCX, options),
			renderFile(pathTocXHTML, options)
		]).then(function([packageOPF, tocNCX, tocXHTML]){

			metadata.packageOPF = packageOPF;
			metadata.tocNCX = tocNCX;
			metadata.tocXHTML = tocXHTML;

			resolve(metadata);
		}).catch(function(error){
			reject(error);
		});
	});
}

// Processes the content in order for templates to generate proper documents.
function processContents(options) {
	/*
		Set max digit length for chapter number.
		Kindle chapter order similar to Linux.
		example: ls -l command returns 2, 20, 21, 3, 30.
	*/
	var maxLength = options.contents.length.toString().length;

	// Add appendChapterTitles + filename to all contents.
	options.contents = _.map(options.contents, function(content, index){
		var titleSlug = uslug(content.title);
		content.fileName = _.padStart((index+1), maxLength, '0') + '_' + titleSlug + '.xhtml';
		content.appendChapterTitles = options.appendChapterTitles;

		return content;
	});
}

// Create me, I am lonely. :(
function createStream(options, templates){
	return 'Not implemented yet.';
}

module.exports = {
	createFile: createFile,
	createStream: createStream
};
