/**
 * Layout and system-theme enhancements for the Pursuit theme.
 */
(() => {
	'use strict';

	const systemColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
	const getPrettifyTheme = () => Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find((link) => (
		link.href.includes('css/prettify/') && !link.href.includes('css/prettify/prettify.css')
	));
	const lightPrettifyTheme = getPrettifyTheme()?.getAttribute('href') ?? null;

	const applySystemTheme = () => {
		const theme = systemColorScheme.matches ? 'dark' : 'light';
		document.documentElement.setAttribute('data-bs-theme', theme);

		getPrettifyTheme()?.remove();
		const prettifyTheme = theme === 'dark' ? 'css/prettify/sons-of-obsidian.css' : lightPrettifyTheme;
		if (prettifyTheme !== null) {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = prettifyTheme;
			document.head.append(link);
		}
	};

	try {
		window.localStorage.removeItem('theme');
		window.localStorage.removeItem('themePrettify');
	} catch {
		// The system theme still works when storage access is unavailable.
	}

	systemColorScheme.addEventListener('change', applySystemTheme);
	applySystemTheme();

	const deleteLinkLabel = document.querySelector('#deletelink span');
	if (deleteLinkLabel !== null) {
		const applyDeleteLinkLabel = () => {
			if (deleteLinkLabel.textContent.trim() !== 'Delete link') {
				deleteLinkLabel.textContent = 'Delete link';
			}
		};

		new MutationObserver(applyDeleteLinkLabel).observe(deleteLinkLabel, {
			childList: true,
			characterData: true,
			subtree: true,
		});
		applyDeleteLinkLabel();
	}

	const settingsPanel = document.getElementById('navbar');
	const settingsSlot = document.getElementById('pursuit-settings-slot');

	if (settingsPanel === null || settingsSlot === null) {
		return;
	}

	settingsSlot.append(settingsPanel);
})();
