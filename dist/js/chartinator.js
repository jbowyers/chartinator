/**
 * Chartinator
 * Version: 0.1.1
 * URL: http://chartinator.com
 * Description: Chartinator transforms data contained in HTML tables into charts using Google Charts
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
 * Chartinator transforms data contained in HTML tables into charts using Google Charts.
 * The 'th' elements in the HTML table must have one of the following 'data-type' attributes:
 * 'string' 'number' 'boolean' 'date' 'datetime' 'timeofday'  or custom values:  'tooltip'
 * The caption element's text is used as a title for the chart
 */

; (function ($, window, document, Math, undefined) {
    
    var chartinator = function (el, options) {

        console.log( 'start');
        
        //  Clone chartinator object
        var o = this;

        //  Define table and chart elements	
        var $tableS = $(el);
        var $chartS = $(el);

        //  Get font family function
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

            // The jQuery selector of the HTML table element to extract the data from.
            // Default: false - Chart extracts data and replaces the HTML table(s) selected above
            tableSel: false,

            fontSize: o.bodyFontSize,

            // Defines the order of column index numbers and text strings to concatenate for a custom tooltip.
            // Default: [] - no tooltip columns
            tooltipConcat: [],

            // The chart type - Options: BarChart, PieChart, ColumnChart, Calendar, GeoChart, Table.
            // Default: 'BarChart'
            chartType: 'BarChart',

            // The class to apply to ta dynamically created chart container element
            chartClass: 'chtr-chart',

            // Google Bar Chart Options
            barChart: {
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
                chartArea: { left: 0, top: 0, width: "100%", height: "100%" },
                fontSize: o.bodyFontSize,
                fontName: o.fontFamily,
                titleTextStyle: {
                    fontSize: o.h3FontSize
                }
            },

            // Google Column Chart Options
            columnChart: {
                fontSize: o.bodyFontSize,
                fontName: o.fontFamily,
                legend: { position: 'bottom' },
                titleTextStyle: {
                    fontSize: o.h3FontSize
                }
            },

            // Google Geo Chart Options
            geoChart: {

            },

            // Google Calendar Chart Options
            calendarChart: {

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
            showChartCSS: { },
            hideChartCSS: { 'opacity': 0}

        };  //  o.optionsInit close

        // Initiate Google Chart options object
        o.cOptions = {};

        // Resize and Pause hover event timer function
        o.timer = false;

        // Initialize table clone
        o.tableClone = false;

        console.log('vars-end' + $tableS.attr('id'));

        //  Initiate slider ======================================================================
        o.init = function (el, options) {   //  Can be re-initiated
            console.log('init-start' + $tableS.attr('id'));

            //  Merge options
            o.options = $.extend({}, o.optionsInit, options);

            // Set table element
            if (o.options.tableSel) {
                $tableS = ($(o.options.tableSel).length) ? $(o.options.tableSel) : $tableS;
            }

            if ($chartS[0] === $tableS[0]) {

                // Insert a new chart element after the table
                $chartS = $( '<div class="' + o.options.chartClass + '"></div>' ).insertAfter( $tableS );
            }

            // If table element exists draw chart
            if ($tableS.length) {
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
                                $chartS.removeAttr('style');
                                $tableS.removeAttr('style');
                                o.drawChart();
                            }, 500 );

                        }
                    }
                });
            } else {

                // Chart and or HTML table not found - Show HTML table and remove chart
                o.showTableChart('show', 'remove');
                console.log('Chart and or HTML table not found');
            }
        };  //  o.init close

        // Chart Functions ===================================================================

        o.setupChart = function() {

            // Get table clone
            if (!o.tableClone) {
                o.tableClone = $tableS.clone();
            }

            // Hide chart and HTML table
            o.showTableChart('hide', 'hide');

            // Set chartPackage - Options: corechart, calendar, geochart, table - The Google Chart Package to load.
            var chartPackage = 'corechart';
            if (o.options.chartType === 'Table') {
                chartPackage = 'table';
            } else if (o.options.chartType === 'Calendar') {
                chartPackage = 'calendar';
            } else if (o.options.chartType === 'GeoChart') {
                chartPackage = 'geochart';
            }

            try {

                $.ajax({
                    url: o.options.urlJSAPI,
                    dataType: "script",
                    cache: true
                })
                    .done(function () {

                        // Create and draw Chart
                        google.load('visualization', '1', {
                            packages: [chartPackage],
                            callback: o.drawChart
                        });
                        console.log('Create and draw Chart');
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
                console.log(e + $tableS.attr('id'));
            }
        };

        o.drawChart = function ( ) {
            console.log('draw-start' + $tableS.attr('id'));

            var cOptions = {};

            // Extract Data from Table ----------------------------------------------------------
            var caption = o.tableClone.find('caption').text();
            var $headerCells = o.tableClone.find('th');
            var $rows = o.tableClone.find('tr');

            // Create dataTable -----------------------------------------------------------------

            var data = new google.visualization.DataTable();

            try {

                // Add columns to dataTable
                $headerCells.each(function (column, v) {
                    var $th = $(this);
                    if ($th.attr('data-type') !== 'tooltip') {
                        data.addColumn($th.attr('data-type'), $th.text());
                    } else if (o.options.tooltipConcat === []) {
                        o.options.tooltipConcat.push(column);
                    }
                });

                // Add tooltip column if needed
                if (o.options.tooltipConcat.length > 0) {
                    data.addColumn({ type: 'string', role: 'tooltip' });
                }

                // Add rows to dataTable
                $rows.each(function () {
                    var row = data.getNumberOfRows();
                    var rowData = [];
                    var toolTipArr = [];
                    // loop through each column and add value rowData array and toolTipArr
                    $(this).find('td').each(function (cell, v) {
                        var $td = $(this),
                            colType = data.getColumnType(cell);
                        if (colType === 'date') {
                            rowData.push(new Date($td.text()));
                        } else if (colType === 'string') {
                            rowData.push($td.text());
                        } else if (colType === 'number') {
                            rowData.push(Number($td.text()));
                        }
                        var ttColIndex = $.inArray(cell, o.options.tooltipConcat);
                        if (ttColIndex !== -1) {
                            toolTipArr[ttColIndex] = $td.text();
                        } else if (colType === 'tooltip') {
                            toolTipArr.push($td.text());
                        }
                    });
                    // add predefined strings to toolTipArr
                    if (rowData.length > 0) {
                        for (var i = 0; i < o.options.tooltipConcat.length; i++) {
                            if (typeof o.options.tooltipConcat[i] === 'string') {
                                toolTipArr[i] = o.options.tooltipConcat[i];
                            }
                        }
                    }
                    // Create tooltip text and add to rowData array
                    if (toolTipArr.length > 0) {
                        var toolTip = '';
                        for (var i = 0; i < toolTipArr.length; i++) {
                            toolTip = toolTip + String(toolTipArr[i]) + ' ';
                        }
                        rowData.push(toolTip);
                    }
                    // add row to dataTable
                    if (rowData.length > 0) {
                        data.addRow(rowData);
                    }
                });
            }
            catch (e) {

                //  Could not create data table - Show table remove chart
                o.showTableChart('show', 'remove');
                console.log(e + $tableS.attr('id'));
                return;
            }
            if (data.getNumberOfRows() === 0) {

                //  No data - Show table remove chart
                o.showTableChart('show', 'remove');
                console.log('no data' + $tableS.attr('id'));
                return;
            }

            // Format data ----------------------------------------------------------------------

            if (o.options.tableChart.formatter.type !== 'none') {
                console.log(o.options.chartType);
                var formatter = new google.visualization[o.options.tableChart.formatter.type](o.options.tableChart.formatter);
                formatter.format(data, o.options.tableChart.formatter.column); // Apply formatter to column
            }

            // Define Chart Options -------------------------------------------------------------

            // Clone options so we don't overwrite original values
            cOptions = $.extend(true, {}, o.options);

            if (cOptions.chartType === 'BarChart') {
                cOptions = cOptions.barChart;
                cOptions.title = cOptions.title || caption;
                cOptions.height = cOptions.height || o.options.fontSize * 2 * data.getNumberOfRows();
            } else if (cOptions.chartType === 'ColumnChart') {
                cOptions = cOptions.columnChart;
                cOptions.title = cOptions.title || caption;
                cOptions.height = cOptions.height || $chartS.width() * 0.75;
            } else if (cOptions.chartType === 'PieChart') {
                cOptions = cOptions.pieChart;
                cOptions.title = cOptions.title || caption;
                cOptions.height = cOptions.height || $chartS.width() * 0.75;
            } else if (cOptions.chartType === 'GeoChart') {
                cOptions = cOptions.geoChart;
                cOptions.height = cOptions.height || $chartS.width() * 0.75;
            } else if (cOptions.chartType === 'Calendar') {
                cOptions = cOptions.calendarChart;
                cOptions.title = cOptions.title || caption;
            } else if (o.options.chartType === 'Table') {
                cOptions = cOptions.tableChart;
            } else {
                console.log('Not a recognized chart type');
                // Chart failed - Show HTML table and remove chart
                o.showTableChart('show', 'remove');
                return;
            }

            // Draw chart ----------------------------------------------------------------------

            // Create and draw the visualization.
            var chart = new google.visualization[o.options.chartType]($chartS.get(0));

            //  Add ready and error event listeners
            google.visualization.events.addListener(chart, 'ready', function (e) {
                // Show chart
                o.showTableChart(o.options.showTable, 'show');
                console.log('drawn ' + $tableS.attr('id'));
            });
            google.visualization.events.addListener(chart, 'error', function (e) {
                // Show table remove chart
                o.showTableChart('show', 'remove');
                console.log('draw error on ' + $tableS.attr('id') + e);
            });

            //  Draw chart
            chart.draw(data, cOptions);



            console.log('draw-end' + $tableS.attr('id'));
        }; // drawChart close


        //  Show, hide or remove chart and table
        o.showTableChart = function (table, chart) {    //  Values: 'show', 'hide', or 'remove'
            var tableLen = $tableS.length;
            var chartLen = $chartS.length;

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
