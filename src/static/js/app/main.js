$(document).ready(() => {
  getYears();
  getCensusType();
  getCensusPercentage('Adherents'); // Default Selection
  // submitForm();

  $('#sel-map-type').change(() => {
    const name = $('#sel-map-type option:selected').text();
    $('#sel-map-percentage').empty();
    getCensusPercentage(name);
  });


  function setCounties() {
    if ($('input:radio[name=opt-map-geography]:checked').val() === 'COUNTY') {
      const glid = $('#sel-states').val(); // id number for states
      getCounties(glid);
      console.log('true');
    } else {
      console.log('false');
    }
  }
  $('input:radio[name=opt-map-geography]').change(() => {
    setCounties();
    console.log('counties set');
    if ($('input:radio[name=opt-map-geography]:checked').val() === 'COUNTRY') {
      $('#sel-states').hide()
      $('#sel-county').empty();
    } else if ($('input:radio[name=opt-map-geography]:checked').val() === 'STATE') {
      $('#sel-county').hide()
      $('#sel-states').show()
    } else if ($('input:radio[name=opt-map-geography]:checked').val() === 'COUNTY') {
      $('#sel-county').show()
      $('#sel-states').show()
    }
  });
  $('#sel-states').change(() => {
    $('#sel-county').empty();
    setCounties();
    console.log('state changed');
  });

    $('#map-info').on('submit', (e) => {
      // submits form via ajax get
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
        parameters,
        data; // parameters for the query to ajax

      if ($('input[name="opt-map-geography"]:checked').val() === "COUNTRY") {
        glid = '011'; // sets global identifier to be equal to country by default
      } else if ($('input[name="opt-map-geography"]:checked').val() === "STATE") {
        glid = $('#sel-states').val() + "0";
      } else if ($('input[name="opt-map-geography"]:checked').val() === "COUNTY") {
        glid = $('#sel-county').val();
      }

      if ($("#sel-map-type").val() === '1' && $("#sel-map-percentage").val() === '1') {
        rcvi2 = '5' // default value for chart is for adherents and as counts
      } else {
        rcvi2 = $('#sel-map-percentage').val()
      }

      parameters = {
        geog: $('input:radio[name=opt-map-geography]:checked').val(),
        rcvi: $('#sel-map-percentage').val(),
        DominantReligion: $('input:radio[name=opt-map-representation]:checked').val(),
        dy: $('#sel-year').val(),
        glid,
        dy2: $('#sel-year').val(),
        rcvi2,
        NumberofClusters: '5',
        ColorScheme: 'Reds',
        DenomFamily: '0',
        DenomFamily2: '0',
        FromPie: 'true',
      };
      $form = $('form.map-info');
      parameters = $.param(parameters);
      const url = 'https://in-polis-app28.ads.iu.edu/daarws/GetTreeMapData.aspx?';
      deleteSvg();

      if (document.URL.indexOf("/tree") !== -1){
        visualizeTree(url + parameters);
      }
      else if (document.URL.indexOf("/map") !== -1) {
        visualizeMap("data/dmd.json", "data/us.json");
      }
      else if (document.URL.indexOf("/pie") !== -1) {
        visualizePieChart(url + parameters);

      }
    });

  // Form submit function.
  function autoSubmitForm() {
    console.log('Submitting form...');
    $('#map-info').submit();
  }
  const autoSubmit = setTimeout(() => {
    autoSubmitForm();
  }, 1000);
});