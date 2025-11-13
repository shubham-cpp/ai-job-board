local customizations = {
	{ rule = "style/*",   severity = "off", fixable = true },
	{ rule = "format/*",  severity = "off", fixable = true },
	{ rule = "*-indent",  severity = "off", fixable = true },
	{ rule = "*/indent",  severity = "off", fixable = true },
	{ rule = "*-spacing", severity = "off", fixable = true },
	{ rule = "*-spaces",  severity = "off", fixable = true },
	{ rule = "*-order",   severity = "off", fixable = true },
	{ rule = "*-dangle",  severity = "off", fixable = true },
	{ rule = "*-newline", severity = "off", fixable = true },
	{ rule = "*quotes",   severity = "off", fixable = true },
	{ rule = "*semi",     severity = "off", fixable = true },
}

local lspconfig = require("lspconfig")
-- Enable eslint for all supported languages
lspconfig.eslint.setup({
	filetypes = {
		"javascript",
		"javascriptreact",
		"javascript.jsx",
		"typescript",
		"typescriptreact",
		"typescript.tsx",
		"vue",
		"html",
		"markdown",
		"json",
		"jsonc",
		"yaml",
		"toml",
		"xml",
		"gql",
		"graphql",
		"astro",
		"svelte",
		"css",
		"less",
		"scss",
		"pcss",
		"postcss",
	},
	settings = {
		-- Silent the stylistic rules in you IDE, but still auto fix them
		rulesCustomizations = customizations,
	},
})
vim.lsp.config("eslint", {
	filetypes = {
		"javascript",
		"javascriptreact",
		"javascript.jsx",
		"typescript",
		"typescriptreact",
		"typescript.tsx",
		"vue",
		"html",
		"markdown",
		"json",
		"jsonc",
		"yaml",
		"toml",
		"xml",
		"gql",
		"graphql",
		"astro",
		"svelte",
		"css",
		"less",
		"scss",
		"pcss",
		"postcss",
	},
	settings = {
		-- Silent the stylistic rules in you IDE, but still auto fix them
		rulesCustomizations = customizations,
	},
})
local ok, null_ls = pcall(require, "null-ls")
if ok then
	null_ls.disable({ name = "prettierd" })
end
