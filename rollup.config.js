import rollupPluginSpl from "rollup-plugin-spl";

export default {
	input: "src/index.js",
	external: ["fs", "inquirer", "inquirer-autocomplete-prompt", "inquirer-path", ],
	output: [{
			file: "target/splconfigurator.cjs.js",
			format: "cjs",
		},
		{
			file: "target/splconfigurator.es.js",
			format: "es",
		},
	],
	plugins: [rollupPluginSpl({
		model: "model.json",
		config: "defaultConfig.json",
		autocomplete: {
			preference: true,
		},
	}), ],
};