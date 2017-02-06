function getYears() {
  const url = 'https://in-polis-app28.ads.iu.edu/daarws/religioncensusvariables.xml';
  $.ajax({
    // Get list of applicable years and appends the value to dropdown menu
    type: 'GET',
    // url: cors_proxy + url,
    url,
    success(xml) {
      $(xml).find('ReligionCensusYear').each(function () {
        const year = $(this).attr('data');
        $('#sel3').append(`<option value='${year}'>${year}</option>`);
      });
    },
  });
}
