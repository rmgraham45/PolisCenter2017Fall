$(document).ready(() => {
  getYears();
  getCensusType();
  getCensusPercentage('Adherents'); // Default Selection

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
      rcvi: $('#sel2').val(),
      DominantReligion: $('input:radio[name=opt-map-representation]:checked').val(),
      dy: $('#sel3').val(),
      glid: '011',
      dy2: $('#sel3').val(),
      rcvi2: $('#sel1').val(),
      NumberofClusters: '5',
      ColorScheme: 'Reds',
      DenomFamily: '0',
      DenomFamily2: '0',
      FromPie: 'true',
    };
    $form = $('form.map-info');
    console.log(parameters);
    parameters = $.param(parameters);
    const url = 'https://in-polis-app28.ads.iu.edu/daarws/GetTreeMapData.aspx?';
    deleteSvg();
    visualizePieChart(url + parameters);
  });

  $('#sel1').change(function () {
    // alert($(this).val());
    const name = $('#sel1 option:selected').text();
    $('#sel2').empty();
    getCensusPercentage(name);
  });

  $('input:radio[name=opt-map-geography]').change(function() {
    if($(this).val() === 'COUNTY') {
		    var glid = $('#sel-states').val() // id number for states
        getCounties(glid);
        console.log("COUNTY") 

    }
    else {

		console.log("COUNTRY")	
}}
);
});