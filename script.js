(async function () {
	function log(msg) {
		console.log(msg);
	}

	var activeBoatsResponse = await fetch('https://localhost:44372/api/boats');
	if (!activeBoatsResponse.ok) {
		alert('api layer is down');
	}

	var responseJson = await activeBoatsResponse.json();

	var activeBoats = [].concat(
		responseJson.active.results,
		responseJson.pending.results
	);

	var target = document.getElementById('target');
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

	activeBoats.forEach((activeBoat) => {
		var cardContainer = buildCardContainer(activeBoat);
		buildCardBody(cardContainer, activeBoat);
		buildCardFooter(cardContainer, activeBoat);

		row.appendChild(cardContainer);
	});

	target.appendChild(section);

	function buildCardContainer(activeBoat) {
		let cardContainer = document.createElement('div');
		cardContainer.classList.add('card', 'h-100', 'mt-2', 'mx-1');

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
		boatTitle.innerHTML = activeBoat.MakeStringExact;

		let salesStatus = document.createElement('div');
		salesStatus.classList.add('text-center');
		salesStatus.innerHTML = activeBoat.ModelExact;

		let price = document.createElement('div');
		price.classList.add('text-center');
		price.innerHTML = activeBoat.Price;

		salesStatus.prepend(boatTitle);
		cardBody.appendChild(salesStatus);

		cardContainer.appendChild(cardBody);
	}

	function buildCardFooter(cardContainer, activeBoat) {
		var cardFooter = document.createElement('div');
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
