/**
 * Responsive layout enhancements for the Pursuit theme.
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

	const mobileLayout = window.matchMedia('(max-width: 767.98px)');
	const settingsPanel = document.getElementById('navbar');
	const desktopContainer = settingsPanel?.parentElement;
	const mobileSlot = document.getElementById('pursuit-settings-mobile-slot');

	if (settingsPanel === null || desktopContainer === null || mobileSlot === null) {
		return;
	}

	const desktopNextSibling = settingsPanel.nextSibling;

	const updateSettingsPlacement = () => {
		if (mobileLayout.matches) {
			mobileSlot.append(settingsPanel);
			return;
		}

		desktopContainer.insertBefore(settingsPanel, desktopNextSibling);
	};

	mobileLayout.addEventListener('change', updateSettingsPlacement);
	updateSettingsPlacement();
})();
