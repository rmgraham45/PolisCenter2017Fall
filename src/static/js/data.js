$(document).ready(() => {
  getYears();
  getCensusType();

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
      DominantReligion: $('input:radio[name=opt-map-representation]:checked').val(),
      dy: $('#sel3').val(),
      glid: '011',
      dy2: $('#sel3').val(),
      rcvi2: '4',
      NumberofClusters: '5',
      ColorScheme: 'Reds',
      DenomFamily: '0',
      DenomFamily2: '0',
      FromPie: 'true',
      // $('input[name="opt-map-representation"]:checked').val()
    };
    $form = $('form.map-info');
    parameters = $.param(parameters);
    const url = 'https://in-polis-app28.ads.iu.edu/daarws/GetTreeMapData.aspx?';
    deleteSvg();
    visualizePieChart(url + parameters);
  });

  // $('#sel1').change(function () {
  //   // alert($(this).val());
  //   const name = $('#sel1 option:selected').text();
  //   getCensusType();
  // });
});
