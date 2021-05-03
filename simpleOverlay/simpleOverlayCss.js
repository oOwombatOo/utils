export default `
/* Overlay Styles
   -------------- */
body {
	position: relative;
}

.imagesOverlay {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 100%;
	background-color: rgba(0, 0, 0, .9);
	text-align: center;
}

.imagesOverlay__div--content {
	margin: 0 auto 50px;
	position: relative;
}

.imagesOverlay__div--content img {
}

.imagesOverlay--hidden {
	display : none;
}

.imagesOverlay__button--close {
	position: fixed;
	z-index: 999999999;
	padding-top: 20px;
	font-weight: bold;
	height: 30px;
	border: 3px solid darkcyan;
	display: inline-block;
	border-radius: 5px;
	padding: 0px 30px;
	opacity: 0.7;
	top: 20px;
	background: white;
}

.imagesOverlay__button--close:hover {
	background: white;
	color: darkcyan;
	opacity: 1;
}`;
