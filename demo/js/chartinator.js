/**
 * Chartinator
 * Version: 0.2.2
 * URL: http://chartinator.com
 * Description: Chartinator transforms data contained in HTML tables and js arrays into charts using Google Charts
 * Requires: jQuery
 * Author: jbowyers
 * Copyright: 2014-2015 jbowyers
 * License: This file is part of Chartinator.
 * Chartinator is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Chartinator is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/
 *
 * ABOUT CHARTINATOR  ===========================================================================
 * Chartinator transforms data contained in HTML tables and js arrays into charts using Google Charts.
 * th elements in HTML table should have one of the following:
 * 'data-type' attributes: 'string' 'number' 'boolean' 'date' 'datetime' 'timeofday'
 * or 'data-role' attributes:  'tooltip','annotation'
 * The caption element's text is used as a title for the chart
 *
 * Apply the jQuery Chartinator plugin to the chart canvas(es)
 * or select the table(s) and Chartinator will insert a new chart canvas(es) after the table
 * or create js data arrays
 * See the readme file for more info
 */

; (function ($, window, document, Math, undefined) {
    
    var chartinator = function (el, options) {
        
        //  The chartinator object
        var o = this;

        //  Define table and chart elements	
        var $tableS = $(el);
        var $chartS = $(el);

        //  Get font-family function
        o.getFontFamily = function (selector, dFamily) {
            var family = $(selector).css('font-family').replace(/["']{1}/gi, "") || dFamily;
            return family;
        };

        //  Define fonts
        o.bodyFontSize = parseInt($('body').css('fontSize'), 10);
        o.h3FontSize = parseInt($('h3').css('fontSize'), 10);
        o.fontFamily = o.getFontFamily('body', 'Arial, Helvetica, sans-serif');

        //  Initialize option defaults ------------------------------------------------------------
        o.optionsInit = {

            // The path to the Google AJAX API
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

            // Rows - The rows data-array
            // If colIndexes array has values the row data will be inserted into the columns
            // defined in the colindexes array. Otherwise the row data will be appended
            // to any existing row data extracted from an HTML table
            // Default: false
            rows: false,

            // The jQuery selector of the HTML table element to extract the data from.
            // Default: false - Chart extracts data and replaces the HTML table(s) selected above
            tableSel: false,

            // Ignore column indexes array - An array of column indexes to ignore in the HTML table
            // Default: []
            // Note: Only works when extracting data from HTML tables
            ignoreCol: [],

            fontSize: o.bodyFontSize,

            // The tooltip concatenation - Defines a string for concatenating a custom tooltip.
            // Keywords: 'domain', 'data', 'label' - these will be replaced with current values
            // 'domain': the primary axis value, 'data': the data value, 'label': the column title
            // Default: false - use Google Charts tooltip defaults
            // Note: Only works when extracting data from HTML tables
            // Not supported on pie, calendar charts
            tooltipConcat: false,

            // The annotation concatenation - Defines a string for concatenating a custom annotation.
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

            // Google Bar Chart Options
            barChart: {

                // The chart height aspect ratio custom option - Not a Google Chart option
                // Used to refactor the chart height relative to the width in responsive designs
                // this is overridden if the height option has a value
                chartHeightRatio: 0.75,

                chartArea: { left: "20%", top: 40, width: "75%", height: "85%" },
                fontSize: o.bodyFontSize,
                fontName: o.fontFamily,
                titleTextStyle: {
                    fontSize: o.h3FontSize
                },
                legend: { position: 'bottom' }
            },

            // Google Pie Chart Options
            pieChart: {

                // The chart height aspect ratio custom option - Not a Google Chart option
                // Used to refactor the chart height relative to the width in responsive designs
                // this is overridden if the height option has a value
                chartHeightRatio: 0.75,

                chartArea: { left: 0, top: 0, width: "100%", height: "100%" },
                fontSize: o.bodyFontSize,
                fontName: o.fontFamily,
                titleTextStyle: {
                    fontSize: o.h3FontSize
                }
            },

            // Google Column Chart Options
            columnChart: {

                // The chart height aspect ratio custom option - Not a Google Chart option
                // Used to refactor the chart height relative to the width in responsive designs
                // this is overridden if the height option has a value
                chartHeightRatio: 0.75,

                fontSize: o.bodyFontSize,
                fontName: o.fontFamily,
                legend: { position: 'bottom' },
                titleTextStyle: {
                    fontSize: o.h3FontSize
                }
            },

            // Google Geo Chart Options
            geoChart: {

                // The chart height aspect ratio custom option - Not a Google Chart option
                // Used to refactor the chart height relative to the width in responsive designs
                // this is overridden if the height option has a value
                chartHeightRatio: 0.75

            },

            // Google Calendar Chart Options
            calendarChart: {

                // The chart height aspect ratio custom option - Not a Google Chart option
                // Used to refactor the chart height relative to the width in responsive designs
                // this is overridden if the height option has a value
                chartHeightRatio: 0.3,

                // The cell scaling factor custom option - Not a Google Chart option
                // Used to refactor the cell size in responsive designs
                // this is overridden if the calendar.cellSize option has a value
                cellScaleFactor: 0.017,

                calendar: {
                    monthLabel: {
                        fontName: o.fontFamily,
                        fontSize: o.bodyFontSize
                    },
                    dayOfWeekLabel: {
                        fontName: o.fontFamily,
                        fontSize: o.bodyFontSize * 0.8
                    }
                }
            },

            // Google Table Chart Options
            tableChart: {

                // Format a data column in a Table Chart
                formatter: {

                    // Formatter type - Options: 'none', 'BarFormat'
                    type: 'none',

                    // The index number of the column to format. Options: 0, 1, 2, etc.
                    column: 1
                },

                // Allow HTML in cells. default: false
                allowHtml: true,

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

            // Show table along with chart. String, Options: 'show', 'hide', 'remove'
            showTable: 'hide',

            // The CSS to apply to show or hide the table and chart
            showTableCSS: { 'position': 'static', 'top': 0, 'width': '' },
            hideTableCSS: { 'position': 'absolute', 'top': '-9999px', 'width': $tableS.width() },
            showChartCSS: {  },
            hideChartCSS: { 'opacity': 0 }

        };  //  o.optionsInit close

        // Initiate Google Chart options object
        o.cOptions = {};

        // Window resize event timer function
        o.timer = false;

        // Initialize table clone
        o.tableClone = false;

        // Set chartPackage - Options: corechart, calendar, geochart, table - The Google Chart Package to load.
        o.chartPackage = 'corechart';

        //  Initiate Chart ======================================================================
        o.init = function (el, options) {

            var tableHasData = false;
            var caption = '';

            //  Merge options
            o.options = $.extend({}, o.optionsInit, options);

            // Set table element
            if (o.options.tableSel) {
                $tableS = ($(o.options.tableSel + ' td').length) ? $(o.options.tableSel) : $tableS;
            }

            // Check table for data
            tableHasData = $tableS.find('td').length;

            // Get table clone and caption
            if (tableHasData) {

                o.tableClone = $tableS.clone();

                // Get caption from Table
                caption = o.tableClone.find('caption').text();
            }

            if ($chartS[0] === $tableS[0]) { // table and chart are the same element
                if (tableHasData) {
                    // Insert a new chart element after the table
                    $chartS = $( '<div class="' + o.options.chartClass + '"></div>' ).insertAfter( $tableS );
                } else { // table does not exist
                    $tableS = false;
                }
            }

            // Clone Google Chart options so we don't overwrite original values
            o.cOptions = $.extend(true, {}, o.options);

            // Apply the Google Chart options and set calculated values
            if (o.cOptions.chartType === 'BarChart') {
                o.cOptions = o.cOptions.barChart;
                o.cOptions.title = o.cOptions.title || caption;
                o.cOptions.height = o.cOptions.height || $chartS.width() * o.cOptions.chartHeightRatio;
            } else if (o.cOptions.chartType === 'ColumnChart') {
                o.cOptions = o.cOptions.columnChart;
                o.cOptions.title = o.cOptions.title || caption;
                o.cOptions.height = o.cOptions.height || $chartS.width() * o.cOptions.chartHeightRatio;
            } else if (o.cOptions.chartType === 'PieChart') {
                o.cOptions = o.cOptions.pieChart;
                o.cOptions.title = o.cOptions.title || caption;
                o.cOptions.height = o.cOptions.height || $chartS.width() * o.cOptions.chartHeightRatio;
            } else if (o.cOptions.chartType === 'GeoChart') {
                o.cOptions = o.cOptions.geoChart;
                o.chartPackage = 'geochart';
                o.cOptions.height = o.cOptions.height || $chartS.width() * o.cOptions.chartHeightRatio;
            } else if (o.cOptions.chartType === 'Calendar') {
                o.cOptions = o.cOptions.calendarChart;
                o.chartPackage = 'calendar';
                o.cOptions.title = o.cOptions.title || caption;
                o.cOptions.height = o.cOptions.height || $chartS.width() * o.cOptions.chartHeightRatio;
                o.cOptions.calendar.cellSize = o.cOptions.calendar.cellSize || $chartS.width() * o.cOptions.cellScaleFactor;
            } else if (o.options.chartType === 'Table') {
                o.cOptions = o.cOptions.tableChart;
                o.chartPackage = 'table';
            } else { // Unrecognized chart type - Chart failed

                // Show HTML table and remove chart
                o.showTableChart('show', 'remove');
                console.log('Unrecognized chart type');
                return;
            }

            // If data exists draw chart
            if (tableHasData || (o.options.rows && o.options.columns)) {

                // Create the chart
                o.setupChart();

                // Window event handlers
                $( window ).on({

                    // Reset on screen resize
                    'resize': function() {

                        // Test if width has resized - as opposed to height
                        if ($( window ).width() !== o.windowWidth) {

                            // Adjust layout
                            clearTimeout( o.timer );
                            o.timer = setTimeout( function() {

                                // Remove js styles
                                $chartS.removeAttr('style');
                                if ($tableS) {
                                    $tableS.removeAttr('style');
                                }

                                // Recalculate calculated option values ---------------------

                                // Recalculate calendar cellSize
                                if ( o.cOptions.calendar && !o.options.calendarChart.calendar.cellSize ) {
                                    o.cOptions.calendar.cellSize = $chartS.width() * 0.017;
                                }

                                // Recalculate height
                                if ( o.cOptions.chartHeightRatio && !(o.options.barChart.height || o.options.pieChart.height || o.options.columnChart.height || o.options.geoChart.height || o.options.calendarChart.height) ) {
                                    o.cOptions.height = $chartS.width() * o.cOptions.chartHeightRatio;
                                }

                                // Redraw chart ---------------------------------------------
                                o.chart.draw( o.data, o.cOptions );

                            }, 500 );
                        }
                    }
                });
            } else {

                // Data not found - Show HTML table and remove chart
                o.showTableChart('show', 'remove');
            }
        };  // o.init close

        // Chart Functions ===================================================================

        o.setupChart = function() {

            // Hide chart and HTML table
            o.showTableChart('hide', 'hide');

            try {

                $.ajax({
                    url: o.options.urlJSAPI,
                    dataType: "script",
                    cache: true
                })
                    .done(function () {

                        // Create and draw Chart
                        google.load('visualization', '1', {
                            packages: [o.chartPackage],
                            callback: o.drawChart
                        });
                    })
                    .fail(function () {

                        // Chart failed - Show HTML table and remove chart
                        o.showTableChart('show', 'remove');
                    })
                ;
            }
            catch (e) {

                // Chart failed - Show HTML table and remove chart
                o.showTableChart('show', 'remove');
                console.log(e);
            }
        }; // o.setupChart close

        o.drawChart = function ( ) {

            // Get data ------------------------------------------------------------------------

            // The array of chart data
            var dataArray = [];

            // Get HTML table data
            if ( o.tableClone && o.tableClone.find( 'td' ).length ) {
                dataArray = o.getTableData();
            }

            // Add/overwrite with js data-array columns
            if ( o.options.columns ) {
                if (dataArray[0] && dataArray[0][0].label) { // header data exists
                    if ( o.options.colIndexes ) { // insert columns
                        for (var i = 0; i < o.options.colIndexes.length; i++) {
                            dataArray[0].splice(o.options.colIndexes[i], 0, o.options.columns[i]);
                        }
                    } else {
                        // Overwrite columns array as first row
                        dataArray[0] = o.options.columns;
                    }
                } else { // header data does not exists
                    // Insert columns array as first row
                    dataArray.unshift(o.options.columns);
                }
            }

            // Add js data-array rows
            if (  o.options.rows && dataArray.length ) { // js data array exists
                if ( o.options.colIndexes ) { // colIndexes array exists
                    for (var i = 0; i < o.options.rows.length; i++) { // loop through each row in js data array
                        for (var j=0; j < o.options.colIndexes.length; j++) { // loop through colIndexes

                            // Insert new data into dataArray
                            dataArray[i+1].splice(o.options.colIndexes[j], 0, o.options.rows[i][j]);
                        }
                    }
                } else { // colIndexes array does not exist
                    // Add rows to end of dataArray
                    $.merge( dataArray, o.options.rows );
                }
            }

            if ( !dataArray.length ) { // No data

                // Show table remove chart
                o.showTableChart('show', 'remove');
                console.log('No data found in data array');
                return;
            }

            // Create dataTable ----------------------------------------------------------------
            o.data = new google.visualization.arrayToDataTable(dataArray);

            if ( !o.data || !o.data.getNumberOfRows() ) { // No data

                // Show table remove chart
                o.showTableChart('show', 'remove');

                console.log('Google Charts data table failed');
                return;
            }

            // Format data ----------------------------------------------------------------------
            if ( o.options.tableChart.formatter.type !== 'none' ) {
                var formatter = new google.visualization[o.options.tableChart.formatter.type](o.options.tableChart.formatter);
                formatter.format( o.data, o.options.tableChart.formatter.column); // Apply formatter to column
            }

            // Revise Chart Options -------------------------------------------------------------
            if ( o.options.chartType === 'BarChart' ) {
                o.cOptions.height = o.cOptions.height || o.options.fontSize * 2 * o.data.getNumberOfRows();
            }

            // Draw chart ----------------------------------------------------------------------

            // Create and draw the visualization.
            o.chart = new google.visualization[o.options.chartType]($chartS.get(0));

            // Add ready and error event listeners
            google.visualization.events.addListener( o.chart, 'ready', function (e) {
                // Show chart
                o.showTableChart(o.options.showTable, 'show');
            });
            google.visualization.events.addListener( o.chart, 'error', function (e) {
                // Show table remove chart
                o.showTableChart('show', 'remove');
            });

            // Draw chart
            o.chart.draw( o.data, o.cOptions );

        }; // o.drawChart close

        // Get data from an HTML table
        o.getTableData = function () {

            // The data table Array - The array of column and row data extracted from the HTML table
            var dataTable = [];

            try {

                // The columns - The collection of the th elements
                var $columns = o.tableClone.find( 'th' );

                // The rows - The collection of HTML table rows
                var $rows = o.tableClone.find( 'tr' );

                // The Array of column objects
                var columnsArr = [];

                // The Custom Tooltip Array - An array of column indexes where a custom tooltip has been defined
                var tooltipArr = [];

                // The Custom Annotation Array - An array of column indexes where a custom annotation has been defined
                var annotationArr = [];

                // Add columns to columnsArr
                $columns.each( function ( column, v ) {

                    if ( o.options.ignoreCol.indexOf(column) === -1) {

                        var $th = $( this );
                        var col = {};

                        // Construct the col object
                        if ( $th.attr( 'data-type' ) ) {
                            col.type = $th.attr( 'data-type' );
                        }
                        if ( $th.attr( 'data-role' ) ) {
                            col.role = $th.attr( 'data-role' );
                        }

                        // Add col object to columnsArr
                        if ( col.role && [ 'tooltip', 'annotation' ].indexOf( col.role ) > -1 ) {
                            if ( col.role === 'tooltip' && tooltipArr.indexOf( column - 1 ) === -1 ) { // No dynamic tt
                                columnsArr.push( col );
                            } else if ( col.role === 'annotation' && annotationArr.indexOf( column - 1 ) === -1 ) { // No dynamic ann
                                columnsArr.push( col );
                            }
                        } else if ( col.type ) {

                            col.label = $th.text();
                            columnsArr.push( col );

                            // Add tooltip column if needed
                            if ( o.options.tooltipConcat && column > 0 ) {

                                columnsArr.push( { type: 'string', role: 'tooltip' } );

                                // Add column index to tooltipArr
                                tooltipArr.push( column );
                            }

                            // Add annotation column if needed
                            if ( o.options.annotationConcat && column > 0 ) {

                                columnsArr.push( { type: 'string', role: 'annotation' } );

                                // Add column index to annotationArr
                                annotationArr.push( column );
                            }
                        }
                    }
                });

                // Add columns to dataTable
                if (columnsArr.length > 0) {
                    dataTable.push(columnsArr);
                }

                // Add rows to dataTable
                $rows.each(function () {

                    // The Array of row data
                    var rowData = [];

                    // The domain - Primary Axis label/value
                    var domain = false;

                    // The adjusted column index - Accounts for dynamically added columns
                    var colIndex = 0;

                    // Loop through each column and add value to rowData array
                    // and add tooltip and annotation data if needed
                    $(this).find('td').each(function (cell, v) {

                        if ( o.options.ignoreCol.indexOf(cell) === -1) {

                            // Initiate variables with td attributes if they exist
                            var $td = $( this ),
                                colType = $td.attr( 'data-type' ),
                                colRole = $td.attr( 'data-role' ),
                                colLabel = 'Axis ' + cell.toString();

                            // Replace variable values with column data if it exists
                            if ( dataTable[ 0 ] && dataTable[ 0 ][ colIndex ] ) {
                                colType = dataTable[ 0 ][ colIndex ].type || colType;
                                colRole = dataTable[ 0 ][ colIndex ].role || colRole;
                                colLabel = dataTable[ 0 ][ colIndex ].label || colLabel;
                            }

                            // Get domain for use with tooltip and annotation
                            if ( colRole === 'domain' || cell === 0 ) {
                                domain = $td.text();
                            }

                            // Add data to rowData array
                            if ( [ 'tooltip', 'annotation' ].indexOf( colRole ) === -1 ) { // Not a tooltip/annotation
                                if ( colType === 'date' ) {
                                    rowData.push( new Date( $td.text() ) );
                                    colIndex++;
                                } else if ( colType === 'number' ) {
                                    rowData.push( Number( $td.text() ) );
                                    colIndex++;
                                } else {
                                    rowData.push( $td.text() );
                                    colIndex++;
                                }
                            } else if ( colRole === 'tooltip' && tooltipArr.indexOf( cell - 1 ) === -1 ) { // No custom tt
                                rowData.push( $td.text() );
                                colIndex++;
                            } else if ( colRole === 'annotation' && annotationArr.indexOf( cell - 1 ) === -1 ) { // No custom ann
                                rowData.push( $td.text() );
                                colIndex++;
                            }

                            // Add tooltip column if needed
                            if ( tooltipArr.indexOf( cell ) > -1 ) {

                                // Define tooltip and replace keywords
                                var toolTip = o.options.tooltipConcat.replace( new RegExp( 'domain', 'g' ), domain );
                                toolTip = toolTip.replace( new RegExp( 'label', 'g' ), colLabel );
                                toolTip = toolTip.replace( new RegExp( 'data', 'g' ), $td.text() );

                                // Add tooltip to rowData
                                rowData.push( toolTip );

                                // Increment colIndex
                                colIndex++;
                            }

                            // Add annotation column if needed
                            if ( annotationArr.indexOf( cell ) > -1 ) {

                                // Define annotation and replace keywords
                                var annotation = o.options.annotationConcat.replace( new RegExp( 'domain', 'g' ), domain );
                                annotation = annotation.replace( new RegExp( 'label', 'g' ), colLabel );
                                annotation = annotation.replace( new RegExp( 'data', 'g' ), $td.text() );

                                // Add annotation to rowData
                                rowData.push( annotation );

                                // Increment colIndex
                                colIndex++;
                            }
                        }
                    });

                    // add row to dataTable
                    if (rowData.length > 0) {
                        dataTable.push(rowData);
                    }
                });
            }
            catch (e) { //  Could not extract data

                console.log(e);
                return [];
            }
            return dataTable;
        };

        // Show, hide or remove chart and table
        o.showTableChart = function (table, chart) {    //  Values: 'show', 'hide', or 'remove'

            var tableLen = $tableS ? $tableS.length : false;
            var chartLen = $chartS ? $chartS.length : false;

            // Table
            if (table === 'show' && tableLen) {
                $tableS.css('opacity', 0);
                $tableS.css(o.options.showTableCSS);
                $tableS.fadeTo(400, 1);
            } else if (table === 'hide' && tableLen) {
                $tableS.css(o.options.hideTableCSS);
            } else if (table === 'remove' && tableLen) {
                $tableS.css('display', 'none');
            }

            // Chart
            if (chart === 'show' && chartLen) {
                $chartS.css('opacity', 0);
                $chartS.css(o.options.showChartCSS);
                $chartS.fadeTo(400, 1);
            } else if (chart === 'hide' && chartLen) {
                $chartS.css(o.options.showChartCSS);
            } else if (chart === 'remove' && chartLen) {
                $chartS.css('display', 'none');
            }
        };

        // initialize --------------------------------------------------------------------------
        o.init(el, options);
        return this;

    };  //  chartinator close

    //  Create the plugin ======================================================================
    $.fn.chartinator = function (options) {
        //  Enable multi-element support
        return this.each(function () {
            var $el = $( this );
            if (!$el.data('chartinator')) {
                $( this ).data( 'chartinator', new chartinator( this, options ) );
            }
        }); 
    };
})(jQuery, window, document, Math);
