# About Chartinator #

**Chartinator** - Google Charts made easier.

* **Description**: A jQuery plugin for transforming HTML tables and js arrays into charts using Google Charts
* **Repository**: https://github.com/jbowyers/chartinator
* **Demo**: http://chartinator.com
* **Bower**: chartinator
* **Requires**: jQuery, Google Charts
* **Author**: jbowyers
* **Copyright**: 2015 jbowyers
* **License**: GPLv3
* **Version: 0.2.0**

## Demo ##

Visit http://chartinator.com to view a demo

### What is this repository for? ###

Transforming HTML tables and js arrays into charts using Google Chart ( https://developers.google.com/chart/ ).

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
* add/modify your HTML tables or js arrays 
* Use jQuery to modify options

### Using Data from HTML Tables ###

Chartinator is designed to extract data from HTML tables. 
The 'th' elements in your HTML table should have one of the following 'data-type' attributes:

* 'string' 
* 'number' 
* 'boolean' 
* 'date' 
* 'datetime' 
* 'timeofday' 

or a data-role attribute:
 
* 'tooltip'
* 'annotation'

The caption element's text will be used as a title for the chart by default

You can also use data extracted from an HTML table and add and replace data with data contained in js data arrays. 
For example you can add column headers, columns of data and rows of data. You can also remove and replace headers 
and columns.

#### Sample HTML ####

```

    <div id="chart_canvas"></div>
    <table id="chart_data">
        <caption>Chart Title</caption>
        <tr>
            <th scope="col" data-type="string">Domain Axis Name</th>
            <th scope="col" data-type="number">Data Axis Name</th>
            <th scope="col" data-role="tooltip">Tooltip</th>
        </tr>
        <tr>
            <td>Data</td>
            <td>Data</td>
            <td>Tooltip text</td>
        </tr> ...
```
### Using Data from JavaScript Arrays ###

You can also use data from JavaScript arrays to completely define the chart data 
or to add to and replace data extracted from an HTML table including the column headers.

The JS data arrays must adhere to the following syntax:

```

    // Columns - The columns data-array
    columns: [
        {label: 'Primary Column Title', type: 'string'},
        {label: 'Data Column Title', type: 'number'},
        {role: 'tooltip', type: 'string'}],

    // Rows - The rows data-array
    rows: [
        ['China', 18, '2015 - 18'],
        ['Japan', 12, '2015 - 12'],
        ['Russia', 10, '2015 - 10'],
        ['Mexico', 5, '2015 - 5'],
        ['Brazil', 6, '2015 - 6'],
        ['Italy', 4, '2015 - 4']],
```

See https://developers.google.com/chart/interactive/docs/datatables_dataviews#arraytodatatable for more info.

### Sample jQuery ###

The Chart must be initialized using jQuery.

```

    <script src="js/chartinator.js" ></script>
    <script type="text/javascript">
        jQuery(function ($) {

            //  Bar Chart Example
            // Use any jQuery selector to select the chart canvas(es)
            var chart1 = $('#barChart').chartinator({

                // Custom Options ------------------------------------------------------
                // Note: This example extracts data from an HTML table 
                // and replaces a row with a tooltip and adds an annotation column
                
                // Columns - The columns data-array
                columns: [
                    {role: 'tooltip', type: 'string'}],

                // Column indexes array - An array of column indexes defining where data 
                // will be inserted into any existing data extracted from an HTML table
                // Default: false - js data array columns replace any existing columns
                // Note: when inserting more than one column be sure to increment 
                // index number to account for previously inserted indexes
                colIndexes: [2],

                // Rows - The rows data-array
                // If colIndexes array has values the row data will be inserted into 
                // the columns defined in the colindexes array. Otherwise the row data 
                // will be appended to any existing row data extracted from an HTML table
                rows: [
                    ['China - 2015'],
                    ['Colombia - 2015'],
                    ['France - 2015']],

                // Ignore column indexes array - An array of column indexes to ignore
                // Default: []
                // Note: Only works when extracting data from HTML tables
                ignoreCol: [2],

                // The jQuery selector of the HTML table element to extract data from
                // Default: false
                // If unspecified, the element this plugin is applied to must be 
                // the HTML table or js columns and rows arrays must be defined
                tableSel: '.barChart',

                // The chart type - String
                // Default: 'BarChart'
                // Options: BarChart, PieChart, ColumnChart, Calendar, GeoChart, Table.
                chartType: 'BarChart',

                // Base Font size in pixels - Number
                // Default: body font size
                fontSize: 20,

                // The annotation concatenation 
                // Defines a string for concatenating a custom annotation.
                // Keywords: 'domain', 'data', 'label' 
                // The keywords will be replaced with current values
                // 'domain': the primary axis value, 
                // 'data': the data value, 
                // 'label': the column title
                // Default: false - use Google Charts annotation defaults
                // Note: Only works when extracting data from HTML tables.
                // Not supported on pie, geo, calendar charts
                annotationConcat: 'domain - label: data',

                // Google Bar Chart Options
                barChart: {

                    // Width of chart in pixels - Number
                    // Default: automatic (unspecified)
                    width: null,

                    // The chart height aspect ratio custom option
                    // Note: This is not a Google Chart option
                    // Used to refactor the chart height relative to the width in 
                    // responsive designs
                    // This is overridden if the height option has a value
                    chartHeightRatio: 0.75,

                    // Height of chart in pixels - Number
                    // Default: automatic (unspecified)
                    // Overrides the chartHeightRatio
                    //height: 400,

                    chartArea: {
                        left: "20%",
                        top: 40,
                        width: "74%",
                        height: "80%"
                    },

                    // The font size in pixels - Number
                    // Default: body font size
                    fontSize: 14,

                    // Font-family name - String
                    // Default: 'Arial'
                    fontName: 'Roboto',

                    // Chart Title - String
                    // Default: Table caption.
                    title: 'Bar Chart Sample',
                    titleTextStyle: {

                        // The chart title font size in pixels - Number
                        // Default: h3 font size
                        fontSize: 20
                    },
                    legend: {

                        // Legend position - String
                        // Options: bottom, top, left, right, in, none.
                        // Default: right
                        position: 'bottom'
                    },

                    // Array of colours
                    colors: ['#3691ff'],

                    // Stack values within a bar or column chart - Boolean
                    // Default: false.
                    isStacked: false,
                    tooltip: {

                        // Shows tooltip with values on hover - String
                        // Options: focus, none.
                        // Default: focus
                        trigger: 'focus'
                    }
                },

                // Show table as well as chart - String
                // Options: 'show', 'hide', 'remove'
                showTable: 'show'
            });
        });
    </script>
```

### List of Options ###

The following is a list of useful options with default values. For more information about Google Chart options visit
https://developers.google.com/chart/

#### All chart types options ####

The following are options that are specific to Chartinator and apply to all chart types unless otherwise specified.

```

    // URL - The path to the Google AJAX API. Default: 'https://www.google.com/jsapi'
    urlJSAPI: 'https://www.google.com/jsapi',
    
    // The data columns js array
    // Default: false
    columns: false,
    
    // Column indexes array - An array of column indexes defining where
    // the data will be inserted into any existing data extracted from an HTML table
    // Default: false - js data array columns replace any existing columns
    // Note: when inserting more than one column be sure to increment index number
    // to account for previously inserted indexes
    colIndexes: false,

    // The data rows js arrays
    // Default: false
    rows: false,
    
    // Ignore column indexes array - An array of column indexes to ignore in the HTML table
    // Default: []
    // Note: Only works when extracting data from HTML tables
    ignoreCol: [],

    // The jQuery selector of the HTML table element to extract the data from.
    // Default: false - Chart extracts data and replaces the HTML table(s) selected above
    tableSel: false,

    // The font size in pixels - Number
    // Default: The body font size
    fontSize: 16,

    // The tooltip string - Defines a string for concatenating a custom tooltip.
    // Keywords: 'domain', 'data', 'label' - these will be replaced with current values
    // 'domain': the primary axis value, 'data': the data value, 'label': the column title
    // Default: false - use Google Charts tooltip defaults
    // Note: Only works when extracting data from HTML tables
    // Not supported on pie, calendar charts
    tooltipConcat: false,

    // The annotation string - Defines a string for concatenating a custom annotation.
    // Keywords: 'domain', 'data', 'label' - these will be replaced with current values
    // 'domain': the primary axis value, 'data': the data value, 'label': the column title
    // Default: false - use Google Charts annotation defaults
    // Note: Only works when extracting data from HTML tables.
    // Not supported on pie, geo, calendar charts
    annotationConcat: false,

    // The chart type - Options: BarChart, PieChart, ColumnChart, Calendar, GeoChart, Table.
    // Default: 'BarChart'
    chartType: 'BarChart',

    // The class to apply to the dynamically created chart container element
    chartClass: 'chtr-chart',
    
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
```

#### Google Bar Chart Options ####

The following are some of the Google Charts Bar Chart options, unless otherwise specified.

```

    // Google Bar Chart Options - Object Literal
    barChart: {
    
        // Width of chart in pixels - Number
        // Default: automatic (unspecified)
        width: null,

        // The chart height aspect ratio custom option - Not a Google Chart option
        // Used to refactor the chart height relative to the width in responsive designs
        // this is overridden if the height option has a value
        chartHeightRatio: 0.75,

        // Height of chart in pixels - Number
        // Default: automatic (unspecified)
        // Overrides the chartHeightRatio
        height: 200,

        chartArea: {
            left: "20%", 
            top: 40, 
            width: "75%", 
            height: "85%"
        },

        // The font size in pixels - Number
        // Default: body font size
        fontSize: 16,

        // Font-family name - String
        // Default: 'Arial'
        fontName: 'Arial',

        // Chart Title - String
        // Default: Table caption.
        title: 'Bar Chart Sample',
        
        titleTextStyle: {

            // The chart title font size in pixels - Number
            // Default: h3 font size
            fontSize: 20
        },
        legend: {

            // Legend position - String
            // Options: bottom, top, left, right, in, none.
            // Default: right
            position: 'right'
        },

        // Array of colours
        colors: ['#3691ff'],

        // Stack values within a bar or column chart - Boolean
        // Default: false.
        isStacked: false,
        tooltip: {

            // Shows tooltip with values on hover - String
            // Options: focus, none.
            // Default: focus
            trigger: 'focus'
        }
    },
```

For a complete list of Bar chart options visit 
[Google Bar Charts](https://developers.google.com/chart/interactive/docs/gallery/barchart#Configuration_Options)

#### Google Pie Chart Options ####

The following are some of the Google Charts Pie Chart options, unless otherwise specified.

```

    // Google Pie Chart Options
    pieChart: {
    
        // Width of chart in pixels - Number
        // Default: automatic (unspecified)
        width: null,

        // The chart height scaling factor custom option - Not a Google Chart option
        // Used to refactor the chart height in responsive designs
        // this is overridden if the height option has a value
        chartHeightRatio: 0.75,

        // Height of chart in pixels - Number
        // Default: automatic (unspecified)
        // Overrides the chartHeightRatio
        height: 200,
    
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
        
        // Makes chart 3D. Boolean, Default: false.
        is3D: false, 
            
        tooltip: {
        
            // String - Shows tooltip with values on hover. 
            // Options: 'focus', 'none'. Default: focus
            trigger: 'focus',
        }
    },
```

For a complete list of Pie Chart options visit 
[Google Pie Charts](https://developers.google.com/chart/interactive/docs/gallery/piechart#Configuration_Options)

#### Google Column Chart Options ####

The following are some of the Google Charts Column Chart options, unless otherwise specified.

```

    // Google Column Chart Options
    columnChart: { 
    
        // Width of chart in pixels - Number
        // Default: automatic (unspecified)
        width: null,

        // The chart height scaling factor custom option - Not a Google Chart option
        // Used to refactor the chart height in responsive designs
        // this is overridden if the height option has a value
        chartHeightRatio: 0.75,

        // Height of chart in pixels - Number
        // Default: automatic (unspecified)
        // Overrides the chartHeightRatio
        height: 200,
    
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

        // Stack values within a bar or column chart. Boolean, Default: false.
        isStacked: false,
        
        tooltip: {
        
            // String - Shows tooltip with values on hover. 
            // Options: 'focus', 'none'. Default: focus
            trigger: 'focus',
        }
    },
```

For a complete list of Column Chart options visit 
[Google Column Charts](https://developers.google.com/chart/interactive/docs/gallery/columnchart#Configuration_Options)

#### Google Geo Chart Options ####

The following are some of the Google Charts Geo Chart options, unless otherwise specified.

```

    // Google Geo Chart Options
    geoChart: { 
    
        // Width of chart in pixels - Number
        // Default: automatic (unspecified)
        width: null,

        // The chart height scaling factor custom option - Not a Google Chart option
        // Used to refactor the chart height in responsive designs
        // this is overridden if the height option has a value
        chartHeightRatio: 0.75,

        // Height of chart in pixels - Number
        // Default: automatic (unspecified)
        // Overrides the chartHeightRatio
        height: 200,
    
        // Background Color - Default: 'white'
        backgroundColor: '#fff',
         
        // Dataless Region Color - Default: '#F5F5F5'
        datalessRegionColor: '#F5F5F5',
        
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
```

Note: this chart type does not display the table caption as a chart heading - add the chart heading manually.  
For a complete list of Geo Chart options visit 
[Google Geo Charts](https://developers.google.com/chart/interactive/docs/gallery/geochart#Configuration_Options)

#### Google Calendar Chart Options ####

The following are some of the Google Charts Calendar Chart options, unless otherwise specified.

```

    // Google Calendar Chart Options
    calendarChart: { 
    
        // The cell scaling factor custom option - Not a Google Chart option
        // Used to refactor the cell size in responsive designs
        // this is overridden if the calendar.cellSize option has a value
        cellScaleFactor: 0.017,

        // Width of chart in pixels - Number
        // Default: automatic (unspecified)
        width: null,

        // The chart height aspect ratio custom option - Not a Google Chart option
        // Used to refactor the chart height relative to the width in responsive designs
        // this is overridden if the height option has a value
        chartHeightRatio: 0.3,

        // Height of chart in pixels - Number
        // Default: automatic (unspecified)
        // Overrides the chartHeightRatio
        height: 200,
                
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
        },
        colorAxis: {
        
            // The colour gradient start and end values
            colors: ['#FF0000', '#00FF00']
        }
    },
```

For a complete list of Calendar Chart options visit 
[Google Calendar Charts](https://developers.google.com/chart/interactive/docs/gallery/calendar#Configuration_Options)

#### Google Table Chart Options ####

The following are some of the Google Charts Table Chart options, unless otherwise specified.

```

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
```

Note: this chart type does not display the table caption as a chart heading - add the chart heading manually.  
For a complete list of Table Chart options visit 
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