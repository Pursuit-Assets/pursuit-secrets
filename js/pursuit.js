/**
 * Responsive layout enhancements for the Pursuit theme.
 */
(() => {
	'use strict';

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
