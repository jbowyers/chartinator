
/**
 * Responsive Menu
 * Version: 0.1.5
 * URL: private
 * Description: A drop-down responsive Menu for responsive layouts
 * Requires: jQuery
 * Optional: Modernizr
 * Author: jbowyers
 * Copyright: 2014-2015 jbowyers
 * License: This file is part of Responsive Menu.
 * Responsive Menu is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Responsive Menu is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see http://www.gnu.org/licenses/
 */

;(function( $, window, document, Math, undefined ) {

    'use strict';
    var pluginName = 'rMenu';

    /**
     * The plugin
     * @param {object} el - The menu container typically a nav element
     * @param {object} options - plugin options object litteral
     * @returns {Plugin}
     * @constructor
     */
    var Plugin = function( el, options ) {

        // Clone this object
        var o = this;

        /**
         * Initialize option defaults and set options =============================
         * @type {{minWidth: string, containerClass: string, toggleSel: string, menuSel: string, menuItemsSel: string, parentClass: string, expandedClass: string, contractedClass: string, transitionSpeed: number, animateClass: string, accelerateClass: string}}
         */
        o.optionsInit = {

            /**
             * Minimum width for expanded layout in pixels - String Should match media query in css file
             * Must be in pixels and include px units if not using Modernizr.
             * @default '769px'
             */
            minWidth: '769px',

            /**
             * The opening and closing speed of the menus in milliseconds
             * @default 400
             */
            transitionSpeed: 400,

            /**
             * The jQuery easing function - used with jQuery transitions
             * @default 'swing'
             * @options 'swing', 'linear'
             */
            jqueryEasing: 'swing',

            /**
             * The CSS3 transitions easing function - used with CSS3 transitions
             * @default 'ease'
             */
            css3Easing: 'ease',

            /**
             * Use button as Toggle Link - instead of text
             * @default true
             */
            toggleBtnBool: true,

            /**
             * The Toggle Link selector
             * @default '.rm-toggle'
             */
            toggleSel: '.rm-toggle',

            /**
             * The menu/sub-menu selector
             * @default 'ul'
             */
            menuSel: 'ul',

            /**
             * The menu items selector
             * @default 'li'
             */
            menuItemsSel: 'li',

            /**
             * The class the plugin adds to the container of the nav element
             * @default 'rm-container'
             */
            containerClass: 'rm-container',

            /**
             * The class the plugin adds to the nav element
             * @default 'rm-nav'
             */
            navElementClass: 'rm-nav',

            /**
             * The class the plugin adds to the top menu element
             * @default 'rm-top-menu'
             */
            topMenuClass: 'rm-top-menu',

            /**
             * The class applied to menu items that contain a sub-menu
             * @default 'rm-parent'
             */
            parentClass: 'rm-parent',

            /**
             * The class applied to container element to trigger expanded layout
             * @default 'rm-layout-expanded'
             */
            expandedClass: 'rm-layout-expanded',

            /**
             * The class applied to container element to trigger contracted layout
             * @default 'rm-layout-contracted'
             */
            contractedClass: 'rm-layout-contracted',

            /**
             * Use CSS3 animation/transitions class name
             * @default 'rm-css-animate'
             * Do not use animation/transitions: ''
             */
            animateClass: 'rm-css-animate',

            /**
             * Force GPU Acceleration class name
             * @default 'rm-accelerate'
             * Do not force: ''
             */
            accelerateClass: 'rm-accelerate',

            /**
             * Use development mode - outputs information to console
             * @default false
             */
            developmentMode: false
        };
        o.options = $.extend( {}, o.optionsInit, options );

        // Define public objects and vars =========================================

        // Toggle Link object
        o.tButton = $( o.options.toggleSel );

        // Nav element object - contains the menus
        o.el = $( el );

        // Container object - contains everything - the Nav element and Toggle Link
        o.container = o.el.parent();

        // All menu elements
        o.menus = o.el.find( o.options.menuSel );

        // Top level menu object - contains the menus
        o.topMenu = o.el.children( o.options.menuSel );

        // Resize and Pause hover event timer function
        o.timer = false;

        // The CSS3 animate class variable
        o.animateClass = o.options.animateClass;

        // The GPU accelerate class variable
        o.accelerateClass = o.options.accelerateClass;

        // The window width - used to verify a window width change
        o.windowWidth = $( window ).width();


        /**
         * Initiate plugin =========================================
         * @returns {Plugin}
         */
        o.init = function() { // Should only be called once

            // Set up the plugin
            o.setup();

            // Window event handlers
            $( window ).on({
                // Reset on screen resize
                'resize': function() {

                    // Test if width has resized - as opposed to height
                    if ($( window ).width() !== o.windowWidth) {

                        // Update the window width
                        o.windowWidth = $( window ).width();

                        // Adjust layout
                        clearTimeout( o.timer );
                        o.timer = setTimeout( o.adjust, 500 );

                    }
                }
            });

            // Contract menu if clicked outside menu
            $( document ).on( 'click.rm', function () {
                    contract( o.topMenu);
                }
            );

            return this;
        };

        /**
         * Setup plugin ============================================================
         * @returns {Plugin}
         */
        o.setup = function() { // Can be called again to reset plugin

            // Add the container class to the nav element's parent element
            o.container.addClass( o.options.containerClass );

            // add rm-button class if using button
            if ( o.options.toggleBtnBool ) {
                o.tButton.addClass( 'rm-button' );
            } else {
                o.tButton.removeClass( 'rm-button' );
            }

            // Add the menus class to the menu elements
            o.menus.addClass( 'rm-menu' );

            // Add and remove classes and add click events
            o.el
                .removeClass( 'rm-nojs' )
                .addClass( o.options.navElementClass )
                .off( 'click.rm' )
                .on( 'click.rm', '.' + o.options.parentClass, parentClick )
                    .find( o.options.menuItemsSel + ':first-child' ).addClass( 'rm-first' ).end()
                    .find( o.options.menuItemsSel + ':last-child' ).addClass( 'rm-last' ).end()
                    .find( o.options.menuItemsSel )
                        .addClass( 'rm-menu-item')
                        .addBack()
                        .removeClass( o.options.parentClass )
                        .has( o.options.menuSel )
                            .addClass( o.options.parentClass )
            ;

            // Make submenus accessibly hidden
            o.menus
                .attr( 'aria-hidden', 'false' )
                .hide();

            // Add top menu class
            o.topMenu.addClass( o.options.topMenuClass );

            if ( o.animateClass ) { // using CSS3 transitions

                // Check if transitions and acceleration are supported
                if ( typeof Modernizr !== 'undefined' ) { // Test with Modernizr
                    if ( !Modernizr.csstransitions ) {
                        o.animateClass = '';
                        o.accelerateClass = '';
                    } else if ( !Modernizr.csstransforms3d ) {
                        o.accelerateClass = '';
                    }
                } else if ( !transitionsSupported() ) {
                    o.animateClass = '';
                    o.accelerateClass = '';
                } else if ( !transform3DSupported()  ) {
                    o.accelerateClass = '';
                }
            } else {
                o.accelerateClass = '';
            }

            // Remove 'rm-nojs' class and add click event to Toggle Link
            o.tButton
                .removeClass('rm-nojs')
                .off( 'click.rm' )
                .on( 'click.rm', tButtonClick);

            // Apply initial layout and adjustments
            o.adjust();

            return this;
        };


        /**
         * Adjust plugin ============================================================
         * @param {String} minWidth  - the min-width value (including units)
         * minWidth must be in pixels if not using Modernizr. Should match media query in css file
         */
        o.adjust = function( minWidth ) {

            // Get the breakpoint minimum width
            minWidth = typeof minWidth !== 'undefined' ? minWidth : o.options.minWidth;

            // Check browser width - set menu layout
            if ( typeof Modernizr !== 'undefined' && Modernizr.mq('only all') ) { // MQs supported - Test with Modernizr
                if ( o.options.developmentMode ) {
                    console.log( 'Modernizr: MQ supported' );
                }
                if ( !Modernizr.mq( '( min-width: ' + minWidth + ' )' ) ) {
                    o.layoutContracted();
                } else {
                    o.layoutExpanded();
                }

            } else { // Unable to detect MQ support - Test width using outerWidth - less reliable
                if ( o.options.developmentMode ) {
                    console.log( 'unable to detect MQ support' );
                }
                if ( $( window ).outerWidth() < parseInt( minWidth ) ) {
                    o.layoutContracted();
                } else {
                    o.layoutExpanded();
                }
            }
        };

        // External Helper Functions ===============================================

        /**
         * Contracted layout
         * @returns {Plugin}
         */
        o.layoutContracted = function() {

            if ( !o.container.hasClass( o.options.contractedClass ) ) { // not contracted

                // Contract any expanded siblings and their children
                contract( o.topMenu );

                // Apply Contracted class
                o.container
                    .removeClass( o.options.expandedClass )
                    .addClass( o.options.contractedClass );

                if ( o.animateClass ) { // using CSS3 transitions

                    // Recalculate menu heights and reset CSS3 transition styles
                    o.calculateHeights();
                    o.menus.addClass( o.animateClass + ' ' + o.accelerateClass );
                }

                // Remove hover events on sub-menu parents
                o.el.off( 'mouseenter.rm mouseleave.rm' );

                // Show Toggle Link and setup topMenu
                o.tButton.addClass( 'rm-show' );
                if ( !o.tButton.hasClass( 'rm-active' ) ) { // topMenu not active

                    // Hide topMenu
                    o.topMenu
                        .addClass( 'accessibly-hidden' )
                        .show();
                    if ( o.animateClass ) { // Using CSS3 transitions
                        o.topMenu
                            .removeClass( 'rm-menu-expanded' );
                    }
                } else { // topMenu is active

                    // Show topMenu
                    o.topMenu
                        .removeClass( 'accessibly-hidden' )
                        .show();
                    if ( o.animateClass ) { // Using CSS3 transitions
                        o.topMenu
                            .css({
                                'max-height': 'none'
                            })
                            .addClass( 'rm-menu-expanded' )
                        ;
                    }
                }
            }

            if ( o.options.developmentMode ) {
                console.log( 'responsive-menu: contracted layout' );
            }
            return this;
        };

        /**
         * Expanded layout
         * @returns {Plugin}
         */
        o.layoutExpanded = function() {

            if ( !o.container.hasClass( o.options.expandedClass ) ) { // not expanded

                // Contract any expanded siblings and their children
                contract( o.topMenu);

                // Apply expanded class to container
                o.container
                    .removeClass( o.options.contractedClass )
                    .addClass( o.options.expandedClass  );

                if ( o.animateClass ) { // using CSS3 transitions

                    // Recalculate menu heights and reset CSS3 transition styles
                    o.calculateHeights();
                    o.menus.addClass( o.animateClass + ' ' + o.accelerateClass );
                }

                // Add hover events to sub-menu parents
                // Must be attached to parent menu item so mouseleave is not triggered when hovering sub-menu
                o.el.off( 'mouseenter.rm mouseleave.rm' )
                    // Add mouseenter to all menu items to ensure sub-menus contract properly
                    .on( 'mouseenter.rm', o.options.menuItemsSel, parentEnter )
                    // mouseleave only needed on sub-menu parents
                    .on( 'mouseleave.rm', o.options.menuItemsSel, parentLeave );

                // Show Menu - Hide Toggle Link
                o.tButton.removeClass( 'rm-show' );
                o.topMenu.removeClass( 'accessibly-hidden' )
                    .show();
                if ( o.animateClass ) { // Using CSS3 transitions
                    o.topMenu
                        .css({
                            'max-height': 'none'
                        })
                        .addClass( 'rm-menu-expanded' )
                    ;
                }
            }
            if ( o.options.developmentMode ) {
                console.log( 'responsive-menu: expanded layout' );
            }
            return this;
        };

        /**
         * Calculate the heights of each submenu and store in data object, reset styles
         * Used when CSS3 transitions are enabled
         * @returns {Plugin}
         */
        o.calculateHeights = function() {

            // Unstyle menus to original state to measure heights and then reapply styles
            o.menus
                .addClass( 'rm-calculate' )
                .removeClass( 'rm-menu-expanded' )
                .attr( 'style', '' )
                .show( 0 );

            // Reselect to force application of styles
            o.menus.each( function () {
                    var $el = $( this );
                    $el
                        .data( 'height', $el.height() )
                    ;
                })
                .css( {
                    'max-height': '0'
                })
                .removeClass( 'rm-calculate' )
            ;
            return this;
        };

        /**
         * Toggle visibility of entire menu
         * @param {Object} el - The toggle Link element
         */
        o.toggleMenu = function( el ) {

            // Contract all sub-menus
            contract( o.topMenu );

            if ( !o.topMenu.hasClass( 'accessibly-hidden' ) ) { // topMenu is visible

                // Hide topMenu
                $( el ).removeClass( 'rm-active' );
                contract( o.container );

            } else { // menu is hidden

                // Show topMenu
                $( el ).addClass( 'rm-active' );
                o.topMenu.removeClass( 'accessibly-hidden' );
                if ( o.animateClass ) { // Using CSS3 transitions
                    o.topMenu.css( 'max-height', '0' );
                } else { // Use jQuery animation
                    o.topMenu.hide( 0 );
                }
                expand( o.el );
            }

        };

        // internal Event Handler Functions ===============================================

        /**
         * Toggle Btn Click event handler
         * @param {event} e - event object
         */
        var tButtonClick = function( e ) {

            e.preventDefault();
            e.stopPropagation();
            o.toggleMenu( e.target );

        };

        /**
         * Sub-menu parent click event handler
         * @param {event} e - event object
         */
        var parentClick = function( e ) {

            var $el = $( e.currentTarget );
            e.stopPropagation();
            if ( !$el.hasClass( 'rm-hover' ) ) {

                e.preventDefault();
                clearTimeout( o.timer );

                // Contract any expanded siblings and their children
                contract( $el.parent() );

                // Expand sub-menu
                expand( $el );
            }

        };

        /**
         * Sub-menu parent mouseenter event handler - used with expanded layout
         * @param {event} e - event object
         */
        var parentEnter = function( e ) {

            // get current target before it changes
            var $el = $( e.currentTarget );

            e.stopPropagation();

            clearTimeout( o.timer );
            o.timer = setTimeout( function () {

                // Contract any expanded siblings and their children
                contract( $el.parent() );

                // Add hover class to menuItem
                $el.addClass( 'rm-hover' );

                // Expand menu
                if ( $el.hasClass( o.options.parentClass ) ) {
                    expand( $el );
                }
            }, 200 );

        };

        /**
         * Sub-menu parent item mouseleave event handler - used with expanded layout
         * @param {event} e - event object
         */
        var parentLeave = function( e ) {

            // get current target before it changes
            var $el = $( e.currentTarget );

            clearTimeout( o.timer );
            o.timer = setTimeout( function () {

                // Contract any expanded siblings and their children
                contract( $el.parent() );
            }, 200 );

        };

        /**
         * The CSS3 Transition End Contract event handler - used to add call-back functions to CSS3 transitions
         * @param {event} e - event object
         */
        var transitionEndContract = function( e ) {

            if ( e.originalEvent.propertyName === 'max-height' ) {
                var $el = $( e.currentTarget );
                e.stopPropagation();

                // Contract menu
                $el
                    .css( {
                        'transition': '',
                        'max-height': '0'
                    } )
                    .removeClass( 'rm-menu-expanded' )
                ;

                if ( $el.hasClass( o.options.topMenuClass ) ) { // is topMenu

                    // accessibly hide topMenu
                    $el
                        .addClass( 'accessibly-hidden' )
                        .show( 0 );
                }
            }

        };

        /**
         * The CSS3 Transition End Expand event handler - used to add call-back functions to CSS3 transitions
         * @param {event} e - event object
         */
        var transitionEndExpand = function( e ) {

            if ( e.originalEvent.propertyName === 'max-height' ) {
                var $el = $( e.currentTarget );
                e.stopPropagation();

                // Expand menu
                $el
                    .removeClass( 'accessibly-hidden' )
                    .css( {
                        'transition': '',
                        'max-height': 'none'
                    } )
                    .addClass( 'rm-menu-expanded' )
                ;
            }

        };

        // Internal Helper Functions ===============================================

        /**
         * Contract sub-menus
         * @param {Object} $parent - The parent element of the menu Item initiating the event
         */
        var contract = function( $parent ) {

            // Blur clicked element and remove hover class from parents
            $parent
                .find( 'a' ).blur().end()
                .find( o.options.menuItemsSel )
                    .removeClass( 'rm-hover' );

            if ( o.animateClass ) { // Using CSS3 transitions
                var $menus = $parent.find( o.options.menuSel );

                // Set max-height to height of each expanded menu
                $menus.each( function(){
                    var $el = $( this );
                    if ( $el.height() !== 0 ) {
                        $el
                            .css( {
                                'max-height': $el.height()
                            } )
                        ;
                    } else {
                        $menus.not( $el );
                    }

                });

                // Must force a redraw so transition will occur
                $menus.hide(0).show(0);

                // Contract menu
                $menus
                    .css( {
                        'transition': 'max-height ' + String( o.options.transitionSpeed / 1000 ) + 's ' + o.options.css3Easing,
                        'max-height': '0'
                    })
                    .removeClass( 'rm-menu-expanded' )
                    .one( 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', transitionEndContract )
                ;

            } else { // Use jQuery animation

                // Contract menus
                $parent.find( o.options.menuSel )
                    .slideUp( o.options.transitionSpeed, o.options.jqueryEasing, function (){
                        if ( $( this ).hasClass( o.options.topMenuClass ) ) {
                            o.topMenu.addClass( 'accessibly-hidden' );
                        }
                    } );
            }

        };

        /**
         * Expand sub-menu
         * @param {Object} $el - The menu Item initiating the event
         */
        var expand = function( $el ) {

            // Define menu
            var $menu = $el.children( o.options.menuSel );

            // Add hover class to parent menuItem
            $el.addClass( 'rm-hover' );

            if ( o.animateClass ) { // Using CSS3 transitions

                // Expand menu
                $menu
                    .css({
                        'transition': 'max-height ' + String( o.options.transitionSpeed / 1000 ) + 's ' + o.options.css3Easing,
                        'max-height': $menu.data('height')
                    })
                    .one( 'transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', transitionEndExpand )
                ;
            } else { // Use jQuery animation

                // Expand menu
                $menu
                    .slideDown( o.options.transitionSpeed, o.options.jqueryEasing );
            }

        };

        // initialize ----------------------------------------------------------------
        o.init( el );

        return this;
    };

    /**
     * Create plugin obects
     * @param {Object} options - Plugin options
     * @returns {*}
     */
    $.fn[ pluginName ] = function( options ) {

        // Return collection of elements
        return this.each( function() {
            var $el = $( this );
            if ( !$el.data( pluginName ) ) {
                $el.data( pluginName, new Plugin( this, options ) );
            }
        });
    };

    // Out of Scope Private functions ==================================================

    /**
     * Test for transform3d support
     * @returns {boolean}
     */
    var transform3DSupported = function() {
        var el = document.createElement('p'),
            has3d,
            transforms = {
                'webkitTransform':'-webkit-transform',
                'OTransform':'-o-transform',
                'msTransform':'-ms-transform',
                'MozTransform':'-moz-transform',
                'transform':'transform'
            };

        // Add it to the body to get the computed style
        document.body.insertBefore(el, null);

        for(var t in transforms){
            if( el.style[t] !== undefined ){
                el.style[t] = 'translate3d(1px,1px,1px)';
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    };

    /**
     * Test for CSS3 transitions support
     * @returns {boolean}
     */
    var transitionsSupported = function() {
        var b = document.body || document.documentElement,
            s = b.style,
            p = 'transition';

        if (typeof s[p] === 'string') { return true; }

        // Tests for vendor specific prop
        var v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
        p = p.charAt(0).toUpperCase() + p.substr(1);

        for (var i=0; i<v.length; i++) {
            if (typeof s[v[i] + p] === 'string') { return true; }
        }

        return false;
    };

})( jQuery, window, document, Math );