(async () => {
	const form = document.getElementById('form');
	const search = document.getElementById('search');

	const label = document.getElementById('label')

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const query = (search.value).replaceAll(' ', '%20')
		const response = await fetchRes(query);
 
		if(response.status !== 404 && query != '') {
			location.href = '../country/country.html?search=' + search.value
		} else {
			search.value = ''

			label.innerText = 'ENTER A VALID COUNTRY'
			label.style.color = '#FF0000'
			label.style.fontSize = '12px'
			label.style.fontWeight = 'bold'
		}
	})


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
})()