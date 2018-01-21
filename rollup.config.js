export default {
	input: "src/index.js",
	external: ["inquirer", "inquirer-autocomplete-prompt", ],
	output: [{
			file: "target/splconfigurator.cjs.js",
			format: "cjs",
		},
		{
			file: "target/splconfigurator.es.js",
			format: "es",
		},
	],
};