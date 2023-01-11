(async () => {
	const query = (window.location.search).replace('?search=', '');
	const response = await fetchRes(query);
	const queryF = findQuery(query, response);

	/**
	 * Capitalizes first letter of each word
	 * @param {*} str 
	 * @returns 
	 */
	function toCapitalize(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}

	/**
	 * API Request to REST countries api
	 * @param {String} query the search query 
	 * @returns JSON body of response
	 */
	async function fetchRes(query) {
		const res = await fetch('https://restcountries.com/v3.1/name/' + query)
		const body = await res.json();
		return body;
	}

	/**
	 * Find the query in the response
	 * @param {String} query 
	 * @param {JSON} response 
	 * @returns a country object in json format
	 */
	function findQuery(query, response) {
		const toLowerQ = (query.replaceAll('%20', ' ')).toLowerCase();

		for(let i = 0; i < response.length; i++) {
			let resName = (response[i].name.common).toLowerCase();
			if(resName.startsWith(toLowerQ)) {
				return response[i];
			}
		}
		return response[0];
	}

	function status(response) {
		if(response.status == 404) {
			location.href = '../index.html'
		} else {
			return;
		}
	}

	function edit(res) {
		document.title = "Countrx | " + res.name.official

		const country = document.getElementById('country');
		country.innerText = res.name.official + ' (' + res.cca3 + ')'

		const coatOfArms = document.getElementById('coatOfArms');
		if(res.coatOfArms.png != undefined)
			coatOfArms.src = res.coatOfArms.png
		else 
			coatOfArms.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Coat-elements.png/375px-Coat-elements.png";

		const status = document.getElementById('status');
		status.innerText = toCapitalize((res.status).replaceAll('-', ' '))

		const unMember = document.getElementById('unMember');
		unMember.innerText = toCapitalize('' + res.unMember)

		const independent = document.getElementById('independent');
		independent.innerText = toCapitalize('' + res.independent)

		const tld = document.getElementById('tld');
		tld.innerText = res.tld

		const cca2 = document.getElementById('cca2');
		cca2.innerText = res.cca2;

		const ccn3 = document.getElementById('ccn3');
		ccn3.innerText = res.ccn3

		const maps = document.getElementById('maps');
		maps.src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyATAfX_upUrGOhhG7NKPT2mv-0Rap-oWj8&q=" + (res.name.common)

		const capital = document.getElementById('capital');
		capital.innerText = res.capital

		const capCoordinates = document.getElementById('capCoordinates');
		capCoordinates.innerText = res.capitalInfo.latlng

		const continents = document.getElementById('continents');
		continents.innerText = res.continents

		const region = document.getElementById('region');
		region.innerText = res.region;

		const subregion = document.getElementById('subregion');
		subregion.innerText = res.subregion

		const coordinates = document.getElementById('coordinates');
		coordinates.innerText = res.latlng

		const borderCountries = document.getElementById('borderCountries');
		if(res.borders != undefined)
			borderCountries.innerText = res.borders
		else 
			borderCountries.innerText = "None"

		const area = document.getElementById('area');
		area.innerText = (res.area).toLocaleString('en-us') + ' sq km'

		const flag = document.getElementById('flag');
		flag.src = res.flags.png

		const demonyms = document.getElementById('demonyms');
		demonyms.innerText = res.demonyms.eng.m

		const currencies = document.getElementById('currencies');
		var currency = "";
		for(var key in res.currencies) {
			currency += key + ' (' + res.currencies[key].symbol + ')'
		}
		currencies.innerText = currency

		const languages = document.getElementById('languages');
		var lang = "";
		for(var key in res.languages) {
			lang += res.languages[key]
		}
		languages.innerText = lang

		const population = document.getElementById('population');
		population.innerText = (res.population).toLocaleString('en-us')

		const gini = document.getElementById('gini');
		var giniCo = "";
		for(var key in res.gini) {
			giniCo += res.gini[key] + ' (' + key + ')'
		}
		gini.innerText = giniCo

		const car = document.getElementById('car');
		car.innerText = toCapitalize(res.car.side)

		const week = document.getElementById('week');
		week.innerText = toCapitalize(res.startOfWeek)

		const postal = document.getElementById('postal');
		postal.innerText = res.postalCode.format

		const root = document.getElementById('root');
		root.innerText = res.idd.root

		const suffixes = document.getElementById('suffixes');
		suffixes.innerText = ((res.idd.suffixes) + '').replaceAll(',', ', ')

		const timezones = document.getElementById('timezones');
		timezones.innerText = ((res.timezones) + '').replaceAll(',', '\n')
	}

	edit(queryF)

})()