/**
 * Responsive layout enhancements for the Pursuit theme.
 */
(() => {
	'use strict';

	const mobileLayout = window.matchMedia('(max-width: 767.98px)');
	const settingsList = document.querySelector('.pursuit-settings-list');
	const expiration = document.getElementById('expiration');
	const mobileSlot = document.getElementById('pursuit-expiration-mobile-slot');

	if (settingsList === null || expiration === null || mobileSlot === null) {
		return;
	}

	const desktopNextSibling = expiration.nextSibling;

	const updateExpirationPlacement = () => {
		if (mobileLayout.matches) {
			mobileSlot.append(expiration);
			return;
		}

		settingsList.insertBefore(expiration, desktopNextSibling);
	};

	mobileLayout.addEventListener('change', updateExpirationPlacement);
	updateExpirationPlacement();
})();
