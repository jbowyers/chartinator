# About Chartinator #

**Chartinator** - Google Charts made easier.

* **Description**: A jQuery plugin for transforming HTML tables into charts using Google Charts
* **Repository**: https://github.com/jbowyers/chartinator
* **Demo**: http://chartinator.com
* **Bower**: chartinator
* **Requires**: jQuery, Google Charts
* **Author**: jbowyers
* **Copyright**: 2015 jbowyers
* **License**: GPLv3
* **Version: 0.1.1**

## Demo ##

Visit http://chartinator.com to view a demo

### What is this repository for? ###

Transforming HTML tables into charts using Google Chart ( https://developers.google.com/chart/ ).

### How do I get set up? ###

* **Download** - Download and extract the Chartinator zip files - https://github.com/jbowyers/chartinator
* **Copy files** - Copy the chartinator.js file to your project
* **Setup the HTML** - Open the chartinator.html sample file and copy and paste the desired html into the 
files in your project. Or, adapt your existing project files to work with chartinator (see Configuration).
* **Link to chartinator.js** - Add a script references in your HTML files
* **Initialize Chartinator** - Activate the plugin using jQuery (see Configuration)

### Using Bower Package Manager ###

The Chartinator repo is registered as a bower package as chartinator.

## Configuration ##

The Chartinator repo includes the chartinator.js plugin file as well as sample HTML. 
To use the plugin you need to: 

* Reference the chartinator.js file in your html
* add/modify your HTML tables
* Use jQuery to modify options

The 'th' elements in your HTML table must have one of the following 'data-type' attributes:

* 'string' 
* 'number' 
* 'boolean' 
* 'date' 
* 'datetime' 
* 'timeofday'  
* or custom values:  
    * 'tooltip'

The caption element's text will be used as a title for the chart by default

### Sample HTML ###

                <div id="chart_canvas"></div>
    <table id="chart_data">
        <caption>Chart Title</caption>
        <tr>
            <th scope="col" data-type="string">Axis Name</th>
            <th scope="col" data-type="number">Other Axis Name</th>
        </tr>
        <tr>
            <td>Data</td>
            <td>Data</td>
        </tr> ...

### Sample jQuery ###

                <script src="js/chartinator.js" ></script>
    <script type="text/javascript">
        jQuery(function ($) {

            //  Bar Chart Example
            // Use any jQuery selector to select the chart canvas(es)
            var chart1 = $('#chart_canvas').chartinator({ 
        
                // Custom Options -----------------------------------

                // The jQuery selector of the HTML table element to extract the data from
                // String, Default: false
                // If unspecified, the element this plugin is applied to must be the HTML table
                tableSel: '#chart_data',
                
                // The chart type - String
                // Options: BarChart, PieChart, ColumnChart, Calendar, GeoChart, Table. 
                // Default: 'BarChart'
                chartType: 'BarChart',
                
                // Base font size in pixels - Number
                // Default: body font size
                fontSize: 16,
                
                // Tooltip concatenation order
                // Defines the order of column index numbers and text strings to concatenate 
                // for a custom tooltip. Default: [] - no tooltip columns
                tooltipConcat: [0], 
        
                // Google Bar Chart Options
                barChart: { 
                    chartArea: { // Sets proportions of chart
                        left: "20%",
                        top: 40,
                        width: "60%",
                        height: "85%"
                    },
                    
                    // The font size in pixels. Integer, Default: body font size
                    fontSize: 16,
                    
                    // The font-family name. String, Default: 'Arial'
                    fontName: 'Arial',
                    
                    // Chart Title. Default: Uses the table caption instead.
                    title: 'The Chart Title',
                    
                    titleTextStyle: {
                        // The chart title font size in pixels. Number, Default: h3 font size
                        fontSize: 24 
                    },
                    legend: {
                        // Controls display of legend. 
                        // Options: bottom, top, left, right, in, none. Default: right
                        position: 'bottom' 
                    },
                    
                    // Array of colours
                    colors: ['#90A046', '#90A046'],
                    
                    // Width of chart in pixels. Number, Default: automatic (unspecified)
                    width: null,
                    
                    // Height of chart in pixels. Number, Default: automatic (unspecified)
                    height: 600,
                    
                    // Stack values within a bar or column chart. Default: false.
                    isStacked: true, 
                    
                    tooltip: {
                        // Shows tooltip with values on hover. 
                        // Options: focus, none. Default: focus
                        trigger: 'none', 
                    }
                },
                
                // Show table as well as chart. String
                // Options: 'show', 'hide', 'remove'
                showTable: 'hide',   
            });
        });
    </script>

### Full List of Options ###
The following is a list of useful options with default values. For more information about Google Chart options visit
https://developers.google.com/chart/

#### All chart types options ####

                // URL - The path to the Google AJAX API. Default: 'https://www.google.com/jsapi'
    urlJSAPI: 'https://www.google.com/jsapi',
    
    // The jQuery selector of the HTML table element to extract the data from
    // String, Default: false
    // If unspecified, the element this plugin is applied to must be the HTML table
    tableSel: false,
    
    // The base font size in pixels - Integer. Default: body font size
    fontSize: ,
    
    // Tooltip Concatenation order Array - Defines the order of column index numbers 
    // and text strings to concatenate for a custom tooltip. Default: [] - no tooltip columns
    tooltipConcat: [],
    
    // Chart type - String. Options: 'BarChart', 'PieChart', 'ColumnChart', 
    // 'Calendar', 'GeoChart', 'Table'. Default: 'BarChart'
    chartType: 'BarChart',
    
    // Show table along with chart - String
    // Options: 'show', 'hide', 'remove'. Default: 'hide'
    showTable: 'hide',  
    
    // The CSS literal used to show the table.
    showTableCSS: { 'position': 'static', 'top': 0 }, 
    
    // The CSS literal used to hide the table.
    hideTableCSS: { 'position': 'absolute', 'top': '-9999px', 'width': $tableS.width() },
     
    // The CSS literal used to show the chart.
    showChartCSS: { }, 
    
    // The CSS literal used to hide the chart.
    hideChartCSS: { 'opacity': 0} 
    
#### Google Bar Chart Options ####
    
                // Google Bar Chart Options - Object Literal
    barChart: {
    
        chartArea: { // The chart proportions
            left: "20%",
            top: 40,
            width: "60%",
            height: "85%"
        },
        
        // The font size in pixels. Number, Default: body font size
        fontSize: ,
        
        // The font family name. String, Default: body font family
        fontName: '',
        
        // Chart Title. String, Default: The table caption text.
        title: '',
        
        titleTextStyle: {
        
            // The chart title font size in pixels. Number, Default: h3 font size
            fontSize:  
        },
        legend: {
        
            // Legend position - Controls display of legend. String 
            // Options: 'bottom', 'top', 'left', 'right', 'in', 'none'. Default: right
            position: 'right' 
        },
        
        // Array of colours
        colors: ['#90A046', '#90A046'],
        
        // Width of chart in pixels. Number, Default: automatic (unspecified)
        width: ,
        
        // Height of chart in pixels. Number, Default: automatic (unspecified)
        height: ,
        
        // Stack values within a bar or column chart. Boolean, Default: false.
        isStacked: false,
        
        tooltip: {
        
            // String - Shows tooltip with values on hover. 
            // Options: 'focus', 'none'. Default: focus
            trigger: 'focus',
        }
    },

For more information about Google Bar Chart options visit 
[Google Bar Charts](https://developers.google.com/chart/interactive/docs/gallery/barchart#Configuration_Options)

#### Google Pie Chart Options ####

                // Google Pie Chart Options
    pieChart: {
    
        chartArea: { // The chart proportions
            left: "20%",
            top: 40,
            width: "60%",
            height: "85%"
        },
        
        // The font size in pixels. Number, Default: body font size
        fontSize: ,
        
        // The font family name. String, Default: body font family
        fontName: '',
        
        // Chart Title. String, Default: The table caption text.
        title: '',
        
        titleTextStyle: {
        
            // The chart title font size in pixels. Number, Default: h3 font size
            fontSize:  
        },
        
        legend: {
        
            // Legend position - Controls display of legend. String 
            // Options: 'bottom', 'top', 'left', 'right', 'in', 'none'. Default: right
            position: 'right' 
        },
        
        // Array of colours
        colors: ['#90A046', '#90A046'],
        
        // Width of chart in pixels. Number, Default: automatic (unspecified)
        width: ,
        
        // Height of chart in pixels. Number, Default: automatic (unspecified)
        height: ,
        
        // Makes chart 3D. Boolean, Default: false.
        is3D: false, 
            
        tooltip: {
        
            // String - Shows tooltip with values on hover. 
            // Options: 'focus', 'none'. Default: focus
            trigger: 'focus',
        }
    },
    
For more information about Google Pie Chart options visit 
[Google Pie Charts](https://developers.google.com/chart/interactive/docs/gallery/piechart#Configuration_Options)

#### Google Column Chart Options ####

                // Google Column Chart Options
    columnChart: { 
    
        chartArea: { // The chart proportions
            left: "20%",
            top: 40,
            width: "60%",
            height: "85%"
        },
        
        // The font size in pixels. Number, Default: body font size
        fontSize: ,
        
        // The font family name. String, Default: body font family
        fontName: '',
        
        // Chart Title. String, Default: The table caption text.
        title: '',
        
        titleTextStyle: {
        
            // The chart title font size in pixels. Number, Default: h3 font size
            fontSize:  
        },

        legend: {
                
            // Legend position - Controls display of legend. String 
            // Options: 'bottom', 'top', 'left', 'right', 'in', 'none'. Default: right
            position: 'right' 
        },
        
        // Array of colours
        colors: ['#90A046', '#90A046'],
        
        // Width of chart in pixels. Number, Default: automatic (unspecified)
        width: ,
        
        // Height of chart in pixels. Number, Default: automatic (unspecified)
        height: ,

        // Stack values within a bar or column chart. Boolean, Default: false.
        isStacked: false,
        
        tooltip: {
        
            // String - Shows tooltip with values on hover. 
            // Options: 'focus', 'none'. Default: focus
            trigger: 'focus',
        }
    },
    
For more information about Google Column Chart options visit 
[Google Column Charts](https://developers.google.com/chart/interactive/docs/gallery/columnchart#Configuration_Options)
    
#### Google Geo Chart Options ####    
    
                // Google Geo Chart Options
    geoChart: { 
    
        // Background Color - Default: 'white'
        backgroundColor: '#fff',
         
        // Dataless Region Color - Default: '#F5F5F5'
        datalessRegionColor: '#F5F5F5',
        
        // Width of chart in pixels. Number, Default: automatic (unspecified)
        width: ,
        
        // Height of chart in pixels. Number, Default: automatic (unspecified)
        height: ,
        
        // Map Region - String, Options: 'world', continent, region, country, states. 
        // Default: 'world'
        region: 'world',
        
        // Resolution - String
        // Options: 'countries', 'provinces', 'metros'. Default: 'countries'
        resolution: 'countries',
        
        legend: {
                
            // Legend position - Controls display of legend. String 
            // Options: 'bottom', 'top', 'left', 'right', 'in', 'none'. Default: right
            position: 'right' 
        },
        
        colorAxis: {
        
            // Start and end colour gradient values. Default: null
            colors: [] 
        },
        
        tooltip: {
                
            // String - Shows tooltip with values on hover. 
            // Options: 'focus', 'none'. Default: focus
            trigger: 'focus',
        }
    },
    
Note: this chart type does not display the table caption as a chart heading - add the chart heading manually.  
For more information about Google Geo Chart options visit 
[Google Geo Charts](https://developers.google.com/chart/interactive/docs/gallery/geochart#Configuration_Options)
    
#### Google Calendar Chart Options #### 
 
                // Google Calendar Chart Options
    calendarChart: { 
    
        // Width of chart in pixels. Number, Default: automatic (unspecified)
        width: ,
        
        // Height of chart in pixels. Number, Default: automatic (unspecified)
        height: ,
                
        calendar: {
        
            // Cell size in pixels. Number, Default: 16
            cellSize: 16, 
            
            monthLabel: {
                
                // String - Default: 'Times-Roman'
                fontName: 'Times-Roman', 
                
                // The month label font size in pixels. number, Default: 16
                fontSize: 16 
            },
            
            monthOutlineColor: {
            
                // The active month outline stroke colour. String, Default: #000
                stroke: '#000', 
            }
        }
    },
    
For more information about Google Calendar Chart options visit 
[Google Calendar Charts](https://developers.google.com/chart/interactive/docs/gallery/calendar#Configuration_Options)
    
#### Google Table Chart Options ####  
    
                // Google Table Chart Options
    tableChart: { 
    
        // Format a data column in a Table Chart
        formatter: { 
        
            // Formatter type - String, Options: 'none', 'BarFormat'. Default: 'none'
            type: 'none',
            
            // The index number of the column to format - Integer
            // Options: 0, 1, 2, etc. Default: 1
            column: 1, 
            
            // Base value number to compare the cell value against. Default: 0
            base: 0, 
            
            // Negative bar color - String 
            // Options: 'red', 'green', 'blue'. Default: 'red'
            colorNegative: 'red',
             
            // Positive bar color - String 
            // Options:'red', 'green', 'blue'. Default: 'blue'
            colorPositive: 'green', 
            
            // Dark base line when negative values are present. 
            // Default value is 'false'
            drawZeroLine: false, 
            
            // Maximum  bar value. Number, Default: highest value in table
            max: , 
            
            // Minimum bar value. Number, Default; lowest value in the table
            min: ,
            
            // Show number values. Boolean, Default: true
            showValue: true, 
            
            // Thickness of each bar in pixels. Number, Default: 100
            width: 100 
        },
        
        // Allow HTML in cells. Boolean, default: true
        allowHtml: true,
        
        // Alternating row styling - Boolean, Default: true
        alternatingRowStyle: true,
        
        // Width of chart in pixels. Number, Default: automatic (unspecified)
        width: ,
        
        // Height of chart in pixels. Number, Default: automatic (unspecified)
        height: ,
        
        // Enable paging - String, Options: enable, event, disable. Default: disable
        page: 'disable', 
        
        // Rows per page. Integer, Default 10
        pageSize: 10, 
        
        // Enable row numbers. Boolean, Default: false
        showRowNumber: false, 
        
        // Enables sorting. String, Options: enable, event, disable. Default: enable
        sort: 'enable', 
        
        // Sort order. Boolean, Default: true
        sortAscending: true, 
        
        // The index of a column to sort. Integer, Default: -1
        sortColumn: -1, 

        // CSS class names - Default: no classes
        cssClassNames: { 
            headerRow: 'headerRow',
            tableRow: 'tableRow',
            oddTableRow: 'oddTableRow',
            selectedTableRow: 'selectedTableRow',
            hoverTableRow: 'hoverTableRow',
            headerCell: 'headerCell',
            tableCell: 'tableCell',
            rowNumberCell: 'rowNumberCell'
        }
    },
    
Note: this chart type does not display the table caption as a chart heading - add the chart heading manually.  
For more information about Google Table Chart options visit 
[Google Table Charts](https://developers.google.com/chart/interactive/docs/gallery/table#Configuration_Options)
    
### Dependencies ###
jQuery, Google Charts

### How to run tests ###
No testing framework at this time

### Task Managers ###
Gruntfile.js and package.json files are included if you want to manage tasks using Grunt.  
Note: The Grunt file uses configuration information contained in the package.json

### Deployment instructions ###
The git repo is versioned and includes a Bower configuration file so the repo can be easily included in your project as a dependency.

## Contribution guidelines ##

Contributions are much appreciated and welcomed.

### Who do I talk to? ###

jbowyers