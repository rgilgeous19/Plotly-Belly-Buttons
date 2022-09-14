function init() {
  //grab reference to dropdown select element
  var selector = d3.selector("#selDataset");

  //use list of sample names tp populate the selected options
  d3.json("samples.json").then((data) => {

    var sampleNames = data.names;

    sampleNames.forEach((sample) => {

      selector

        .append("option")
        .text(sample)
        .property("value", sample);
    });

    var firstSample = sampleNames[0];

    buildCharts(firstSample);

    buildMetadata(firstSample);

  });
}
      
init();
//now, iniatialize the dashboard


function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}
// declaring the first of these functions

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");


    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  }); 
}

// creating the buildcharts function

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    console.log(data);

    var samplesArray = data.samples;

    var sampleNum = samplesArray.filter(sampleObj => sampleObj.id == sample);
   
    var metadata_array = data.metadata.filter(sampleObj => sampleObj.id == sample);

    var firstSample = sampleNum[0];

    var firstMeta = metadata_array[0]


  //creating variables which hold the otu ids, otu labels and sample values

    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sampleValues;

    var wfreq = firstMeta.wfreq;


    // creating yticks for the bar chart

    var yticks = otuIds.slice(0,10).map(id => `OTU ${id}`).reverse();

  var barData = [{
    x: sample_values.slice(0,10).reverse(),
    y: yticks,
    text: otu_labels.slice(0,10).reverse(),
    type:"bar",
    orientation: 'h'
  }];

  //creating a layout for the bar charts
  var barLayout = {
    title: "Top 10 Bacteria Cultures Found",
    xaxis: {title: "Amount"}
  };
   

  Plotly.newPlot("bar", barData, barLayout, {responsive: true});

  var bubbleData = [{
    x: otuIds,
    y: sampleValues,
    text: otuLabels,
    mode: 'markers',
    marker: {
      size: sampleValues,
      color: otuIds,
      colorscale: "Earth"
    }
  }];



  var bubbleLayout = {
    title: 'Bacteria Cultures Per Sample',
    showlegend: false,
    xaxis: {title: "OTU ID", automargin: true},
    yaxis: {title: "Amount", automargin: true},
    hovermode: "closest"
  };
  

  Plotly.newPlot("bubble", bubbleData, bubbleLayout, {responsive: true});

 

  var gaugeData = [
    {
      value: wfreq,
      title: { text: "Belly Button Washing Frequency", font: { size: 20 } },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }]
      }
    }
  ];

  var gaugeLayout = { 
    autosize: true,
    annotations: [{
      xref: 'paper',
      yref: 'paper',
      x: 0.5,
      xanchor: 'center',
      y: 0,
      yanchor: 'center',
      text: "The gauge displays your belly button weekly washing frequency",
      showarrow: false
    }]
  };
  Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
});
}

