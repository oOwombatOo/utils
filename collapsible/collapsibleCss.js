export default `

.collapsible__button {
	font-family: revert;
	font-size: 15px;
	border-radius: 3px;
	padding: 3px 10px;
	opacity: 0.7;
	background-color: black;
	color: white;
	border: none;
	cursor: pointer;
}

.collapsible__content {
	position: relative;
	margin-bottom: 35px;
}

.collapsible__button:hover {
	opacity : 1.0;
}

.collapsible__button--top {
	position: absolute;
	top: 14px;
	right: 20px;
}

.collapsible__button--collapse {
	position: absolute;
	right: 0px;
}

.collapsible--inner {
	overflow: hidden;
}

.collapsible--outer {
	padding: 15px;
	margin: 15px 0;
	background: rgb(240,244,238);
	background: linear-gradient(180deg, rgba(240,244,238,1) 0%, rgba(246,246,246,1) 100%);
	border-radius: 3px;
	position: relative;
	min-height: 10px
}

.collapsible--outer h2 {
	padding: 0;
	margin: 0 0 0.25em 0;
}

.collapsible--outer.collapsed h2 {
	line-height: 1em;
	margin: 0 0 0 0;
	margin-bottom: -0.35em;
}

#mainContent .blocks-gallery-grid {
	display: block;
	width: auto;
	margin: auto;
	text-align: center;
}

#mainContent .wp-block-gallery .blocks-gallery-item {
	display : inline-block;
	overflow : hidden;
	width: 240px;
	height: 240px;
	cursor: pointer;
	margin: 5px;
	flex-grow: 0;
	position: static;
}

#mainContent .wp-block-gallery .blocks-gallery-item img {
	height: 100%;
	margin: auto;
}

`;

