const cors_proxy = 'https://crossorigin.me/';
// cors proxy to avoid access-control-allow-origin-header issues
$(document).ready(() => {
  $('#map-info').on('submit', (e) => {
    e.preventDefault();
    let geog,
      rcvi,
      DominantReligion,
      dy,
      glid,
      dy2,
      rcvi2,
      NumberofClusters,
      ColorScheme,
      DenomFamily,
      DenomFamily2,
      FromPie,
      parameters; // parameters for the query to ajax

    parameters = {
      geog: $('input:radio[name=opt-map-geography]:checked').val(),
      rcvi: '4',
      DominantReligion: $('input:radio[name=opt-map-type]:checked').val(),
      dy: $('#sel3').val(),
      glid: '011',
      dy2: $('#sel3').val(),
      rcvi2: '4',
      NumberofClusters: '5',
      ColorScheme: 'Reds',
      DenomFamily: '0',
      DenomFamily2: '0',
      FromPie: 'true',

    };
    console.log(parameters);
    $form = $('form.map-info');
    parameters = $.param(parameters);
    const url = 'http://in-polis-app28.ads.iu.edu/daarws/GetTreeMapData.aspx?';
    // $.ajax({
    //   type: 'GET',
    //   url: url + parameters,
    //   success(result) {
    //     console.log('success');
    //     console.log(result);
    //     visualizePieChart(result);
    //   },
    //   error(error) {
    //     console.log(error);
    //   },
    // });
    visualizePieChart(url+ parameters)
  });

  function getYears() {
    const url = 'http://in-polis-app28.ads.iu.edu/daarws/religioncensusvariables.xml';
    $.ajax({
            // Get list of applicable years and appends the value to dropdown menu
      type: 'GET',
      // url: cors_proxy + url,
      url: url,
      success(xml) {
        $(xml).find('ReligionCensusYear').each(function () {
          const year = $(this).attr('data');
          $('#sel3').append(`<option value='${year}'>${year}</option>`);
        });
      },
    });
  }
  getYears();


  // d3.request(url)
  //     .get(data, function(result){
  // console.log(result.response)});
});
