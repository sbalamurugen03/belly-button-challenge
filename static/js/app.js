
    // Declaring the URL with the data
    var url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

    // Use the D3 library to read the samples.json json file
    d3.json(url). then ((data) => {
            console.log(data);
    
            var data = data;
    
            // To add test subject IDs to the drop-down field
            var names = data.names;
    
            names.forEach((name) => {
                d3.select("#selDataset").append("option").text(name);
            })
        
            // To initialize the page with default plots
            function init() {
    
                // Choose data for test ID No. 940 plotted as default
                defaultDataset = data.samples.filter(sample => sample.id === "940")[0];
                console.log(defaultDataset);
    
                // Select all sample_values, otu_ids and otu_labels of the selected test ID
                allSampleValuesDefault = defaultDataset.sample_values;
                allOtuIdsDefault = defaultDataset.otu_ids;
                allOtuLabelsDefault = defaultDataset.otu_labels;
    
                // Select the top 10 OTUs for the ID with their sample_values, otu_ids and otu_labels
                sampleValuesDefault = allSampleValuesDefault.slice(0, 10).reverse();
                otuIdsDefault = allOtuIdsDefault.slice(0, 10).reverse();
                otuLabelsDefault = allOtuLabelsDefault.slice(0, 10).reverse();
                
                // To display the data to console
                console.log(sampleValuesDefault);
                console.log(otuIdsDefault);
                console.log(otuLabelsDefault);
    
                // To create BAR chart
                // Add trace for the default Data
                var trace1 = {
                    x: sampleValuesDefault,
                    y: otuIdsDefault.map(outId => `OTU ${outId}`),
                    text: otuLabelsDefault,
                    type: "bar",
                    orientation: "h"
                };
    
                // data
                var barData = [trace1];
    
                // Apply the group bar mode to the layout
                var barlayout = {
                    title: `<b>Top 10 Bacteria Cultures Found<b>`,
                    xaxis: { title: "Number of Bacteria"},
                    yaxis: { title: "OTU ID"},
                    autosize: false,
                    width: 800,
                    height: 600
                }
    
                // Render the plot to the div tag with id "bar"
                Plotly.newPlot("bar", barData, barlayout);
    
                // To create BUBBLE chart
                var trace2 = {
                    x: allOtuIdsDefault,
                    y: allSampleValuesDefault,
                    text: allOtuLabelsDefault,
                    mode: 'markers',
                    marker: {
                        color: allOtuIdsDefault,
                        size: allSampleValuesDefault
                    }
                };
        
                var bubbleData = [trace2];
        
                var bubbleLayout = {
                    title: '<b>Bacteria Cultures Per Sample<b>',
                    xaxis: { title: "OTU ID"},
                    yaxis: { title: "Number of Bacteria"}, 
                    showlegend: false,
                };
        
                Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    
                // To display meta data, the demographic information
                demoDefault = data.metadata.filter(sample => sample.id === 940)[0];
                console.log(demoDefault);
    
                // Display each key-value pair from the metadata JSON object
                Object.entries(demoDefault).forEach(
                    ([key, value]) => d3.select("#sample-metadata").append("p").text(`${key.toUpperCase()}: ${value}`));
     
            }
    
            init();
    
            // Call updatePlot() when a change takes place to the DOM
            d3.selectAll("#selDataset").on("change", updatePlot);
    
            // Below function is called when a dropdown menu item is selected
            function updatePlot() {
    
                        // Use D3 to select the dropdown menu
                        var inputElement = d3.select("#selDataset");
    
                        // Assign the value of the dropdown menu option to a variable
                        var inputValue = inputElement.property("value");
                        console.log(inputValue);
    
                        // Filter the dataset based on inputValue ID
                        dataset = data.samples.filter(sample => sample.id === inputValue)[0];
                        console.log(dataset);
    
                        // Select all sample_values, otu_ids and otu_labels of the selected test ID
                        allSampleValues = dataset.sample_values;
                        allOtuIds = dataset.otu_ids;
                        allOtuLabels = dataset.otu_labels;
    
                // Select the top 10 OTUs for the ID with their sample_values, otu_ids and otu_labels
                top10Values = allSampleValues.slice(0, 10).reverse();
                top10Ids = allOtuIds.slice(0, 10).reverse();
                top10Labels = allOtuLabels.slice(0, 10).reverse();
    
                // BAR Chart
                Plotly.restyle("bar", "x", [top10Values]);
                Plotly.restyle("bar", "y", [top10Ids.map(outId => `OTU ${outId}`)]);
                Plotly.restyle("bar", "text", [top10Labels]);
    
                // BUBBLE Chart
                Plotly.restyle('bubble', "x", [allOtuIds]);
                Plotly.restyle('bubble', "y", [allSampleValues]);
                Plotly.restyle('bubble', "text", [allOtuLabels]);
                Plotly.restyle('bubble', "marker.color", [allOtuIds]);
                Plotly.restyle('bubble', "marker.size", [allSampleValues]);
    
                // Demographic Information
                metainfo = data.metadata.filter(sample => sample.id == inputValue)[0];
    
                // Clear out current contents in the panel
                d3.select("#sample-metadata").html("");
    
                // Display each key-value pair from the metadata JSON object
                Object.entries(metainfo).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));
    
                // Gauge Chart
                var wfreq = metainfo.wfreq;
    
                Plotly.restyle('gauge', "value", wfreq);
            }
            
    });