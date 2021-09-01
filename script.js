(async function () {
	let apiUrl = '';
	if (window.location.href.includes('github')) {
		apiUrl = 'https://buyboatsusapi20210901144629.azurewebsites.net';
	} else if (window.location.href.includes('localhost')) {
		apiUrl = 'https://localhost:44372';
	} else {
		apiUrl = '';
	}
	let spinner = document.getElementById('loader');
	// start spinner
	spinner.style.display = 'block';
	let activeBoatsHTTPResponse = await fetch(`${apiUrl}/api/boats`);
	// end spinner
	spinner.style.display = 'none';

	if (!activeBoatsHTTPResponse.ok) {
		alert('api layer is down');
	} else {
		let activeBoats = await activeBoatsHTTPResponse.json();

		let target = document.getElementById('target');

		if (
			activeBoats.active?.error ||
			activeBoats.pending?.error ||
			(activeBoats.active?.numResults === 0 &&
				activeBoats.pending?.numResults === 0)
		) {
			if (activeBoats.active?.error || activeBoats.pending?.error) {
				console.error(activeBoats.active?.error?.message);
				console.error(activeBoats.pending?.error?.message);
			}
			// no results
			let noBoats = document.createElement('img');
			noBoats.src =
				'https://images.squarespace-cdn.com/content/v1/602944057f812d1e2d2139b9/1628448451719-6PBHE7TKMHQU70Q7LH3I/Coming_Soon.png?format=2500w';
			target.appendChild(noBoats);
		} else {
			let activePendingBoats = [].concat(
				activeBoats.active?.results,
				activeBoats.pending?.results
			);

			let section = document.createElement('section');
			section.className = 'py-5';
			let container = document.createElement('div');
			container.classList.add('container', 'px-4', 'px-lg-5', 'mt-5');
			let row = document.createElement('div');
			row.classList.add(
				'row',
				'gx-4',
				'gx-lg-5',
				'row-cols-2',
				'row-cols-md-3',
				'row-cols-xl-4',
				'justify-content-center'
			);

			container.appendChild(row);
			section.appendChild(container);

			activePendingBoats.forEach((activeBoat) => {
				let cardContainer = buildCardContainer(activeBoat);
				buildCardBody(cardContainer, activeBoat);
				buildCardFooter(cardContainer, activeBoat);

				row.appendChild(cardContainer);
			});

			target.appendChild(section);
		}
	}

	function buildCardContainer(activeBoat) {
		let cardContainer = document.createElement('div');
		cardContainer.classList.add('card', 'h-100', 'mt-2', 'mx-3');

		let img = document.createElement('img');
		img.src = activeBoat.Images[0]?.Uri;
		img.classList.add('card-img-top', 'mt-5');
		img.style.height = '200px';

		cardContainer.appendChild(img);
		return cardContainer;
	}

	function buildCardBody(cardContainer, activeBoat) {
		let cardBody = document.createElement('div');
		cardBody.classList.add('card-body', 'p-4');
		let boatTitle = document.createElement('h5');
		boatTitle.classList.add('fw-bolder');
		boatTitle.innerHTML = activeBoat.ModelYear += ' ';
		boatTitle.innerHTML += activeBoat.MakeStringExact;

		let salesStatus = document.createElement('div');
		salesStatus.classList.add('text-center');
		salesStatus.innerHTML = activeBoat.ModelExact;

		let price = document.createElement('div');
		price.classList.add('text-center', 'text-primary', 'text-weight-bold');
		price.innerHTML = '$' + activeBoat.NormPrice.toLocaleString('en-US');
		salesStatus.prepend(boatTitle);
		cardBody.appendChild(salesStatus);
		salesStatus.appendChild(price);
		cardContainer.appendChild(cardBody);
	}

	function buildCardFooter(cardContainer, activeBoat) {
		let cardFooter = document.createElement('div');
		cardFooter.classList.add(
			'card-footer',
			'p-4',
			'pt-0',
			'border-top-0',
			'bg-transparent'
		);
		let footerInfo = document.createElement('div');
		footerInfo.classList.add('text-center');
		let footerTitle = document.createElement('a');
		footerTitle.href = buildCustomLink(activeBoat);
		footerTitle.target = 'blank';
		footerTitle.classList.add('btn', 'btn-outline-dark', 'mt-auto');
		footerTitle.innerHTML = 'Learn More!';
		cardContainer.appendChild(cardFooter);
		cardFooter.appendChild(footerInfo);
		footerInfo.appendChild(footerTitle);
	}

	function buildCustomLink(activeBoat) {
		let boatTraderUrl = 'https://www.boattrader.com/boat/';
		boatTraderUrl = `${boatTraderUrl}${
			activeBoat.ModelYear
		}-${activeBoat.Model.replace(' ', '-')}-${activeBoat.DocumentID}`;

		return boatTraderUrl;
	}
})();
