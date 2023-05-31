// //  Use D3 library to read in sample.json from the following url: 
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

d3.json(url).then(data =>{
    console.log(data) 
});
// Start dashboard 
function init() {

  // Create dropdown menu with d3 
  let selector = d3.select("#selDataset");

  // Use d3 to get the sample names and populate selector
  d3.json(url).then(data => {

    // Set variable for sample names 
    let sampleNames = data.names;

    // Include samples in dropdown menu
    sampleNames.forEach((id) => {

      // Log value of id for each iteration of the loop 
      console.log(id);

      selector
          .append("option")
          .text(id)
          .property("value", id);
    });

    //  Set first sample from the list 
        let sample_i = sampleNames[0];

         // Log the value of sample_one
         console.log(sample_i);
 
         // Build the initial plots
         buildMetadata(sample_i);
         buildBarChart(sample_i);
         buildBubbleChart(sample_i);
         buildGaugeChart(sample_i);
 
     });
 };

 // Function that populates metadata info
function buildMetadata(sample) {

  // Use D3 to retrieve all of the data
  d3.json(url).then((data) => {

      // Retrieve all metadata
      let metadata = data.metadata;

      // Filter data where id is equal to the sample 
      let filtered_data = metadata.filter(result => result.id == sample);

      // Log the array of metadata objects after they have been filtered
      console.log(filtered_data)

      // Get the first index from the array
      let selected_value = filtered_data[0];

      // Clear out metadata
      d3.select("#sample-metadata").html("");

      // Use Object.entries to add each key/value pair to the panel
      Object.entries(selected_value).forEach(([key,value]) => {

          // Log the individual key/value pairs as they are being appended to the metadata panel
          console.log(key,value);

          d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
      });
  });

};
// Function that builds the bar chart
function buildBarChart(sample) {

  // Use D3 to retrieve all of the data
  d3.json(url).then(data => {

      // Retrieve all sample data
      let sampleData = data.samples;

      // Filter based on value of the sample
      let filtered_data = sampleData.filter(result => result.id == sample);

      // Get the first index from the array
      let selected_value = filtered_data[0];

      // Get the otu_ids, lables, and sample values
      let otu_ids = selected_value.otu_ids;
      let otu_labels = selected_value.otu_labels;
      let sample_values = selected_value.sample_values;

      // Log the data to the console
      console.log(otu_ids,otu_labels,sample_values);

      // Set top ten items to display in descending order
      let sorted_otu_id = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
      let sorted_sample_values = sample_values.slice(0,10).reverse();
      let labels = otu_labels.slice(0,10).reverse();
      
      // Set up the trace for the bar chart
      let trace = {
          x: sorted_sample_values,
          y: sorted_otu_id,
          text: labels,
          type: "bar",
          orientation: "h"
      };

      // Setup the layout
      let layout = {
          title: "Top 10 OTUs Present"
      };

      // Call Plotly to plot the bar chart
      Plotly.newPlot("bar", [trace], layout)
  });
};

// Function that builds the bubble chart
function buildBubbleChart(sample) {

  // Use D3 to retrieve all of the data
  d3.json(url).then(data => {

    // Retrieve all sample data
    let sampleData = data.samples;

    // Filter based on value of the sample
    let filtered_data = sampleData.filter(result => result.id == sample);

    // Get the first index from the array
    let selected_value = filtered_data[0];

    // Set up the trace for the bubble chart
      let trace1 = {
          x: selected_value.otu_ids,
          y: selected_value.sample_values,
          text: selected_value.otu_labels,
          mode: "markers",
          marker: {
              size: selected_value.sample_values,
              color: selected_value.otu_ids,
              colorscale: "Rainbow"
          }
      };

      // Set up the layout
      let layout = {
          title: "Bacteria Per Sample",
          hovermode: "closest",
          xaxis: {title: "OTU ID"},
      };

      // Call Plotly to plot the bubble chart
      Plotly.newPlot("bubble", [trace1], layout)
  });
};

// Function that builds the gauge chart 
function buildGaugeChart(sample) {

  // Use D3 to retrieve all of the data
  d3.json(url).then(data => {

    // Retrieve all metadata
    let metadata = data.metadata;

    // Filter data where id is equal to the sample 
    let filtered_data = metadata.filter(result => result.id == sample);

    // Log the array of metadata objects after the have been filtered
    console.log(filtered_data)

     // Get the first index from the array
     let selected_value = filtered_data[0]

     // Trace for the data for the gauge chart
     let trace2 = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: selected_value.wfreq,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 16}},
      type: "indicator", 
      mode: "gauge+number",
      gauge: {
          axis: {range: [null, 10]}, 
          bar: {color: "rgb(68,166,198)"},
          steps: [
              { range: [0, 1], color: "rgb(233,245,248)" },
              { range: [1, 2], color: "rgb(218,237,244)" },
              { range: [2, 3], color: "rgb(203,230,239)" },
              { range: [3, 4], color: "rgb(188,223,235)" },
              { range: [4, 5], color: "rgb(173,216,230)" },
              { range: [5, 6], color: "rgb(158,209,225)" },
              { range: [6, 7], color: "rgb(143,202,221)" },
              { range: [7, 8], color: "rgb(128,195,216)" },
              { range: [8, 9], color: "rgb(113,187,212)" },
              { range: [9, 10], color: "rgb(98,180,207)" }
          ]
      }
  }];
    // Set up the Layout
    let layout = {
      width: 400, 
      height: 400,
      margin: {t: 0, b:0}
  };
   // Use Plotly to plot the data in a gauge chart
   Plotly.newPlot("gauge", trace2,layout);
});
};

  // Function that updates dashboard when sample is changed
  function optionChanged(selected_value) { 

  // Log the new value
  console.log(selected_value); 

  // Call all functions 
  buildMetadata(selected_value);
  buildBarChart(selected_value);
  buildBubbleChart(selected_value);
  buildGaugeChart(selected_value);
};

// Call the initialize function
init();







