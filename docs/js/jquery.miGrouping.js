/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
(function( $ ){
    var methods = {
        init : function( options ) {

            options = options || {};
            var namespace = options.namespace || "mi";

            var options = $.extend({
                containerClass: namespace + '_container',
                groupClass: namespace + '_group',
                titlebarClass: namespace + '_group_title',
                contentClass: namespace + '_group_content',
                ajaxUrlClass: namespace + '_ajax_url',
                activate: 0,
                ajaxContent: false,
                beforeInit: function(container){},
                afterInit: function(container){},
                beforeOpen: function(handler, ui, indexToOpen){},
                afterOpen: function(handler, ui, indexToOpen){},
                scrollInView: false,
                scrollClass: namespace + '_group_anchor',
                changeAll: false,
                setGroupHeights: true,
                equalGroupHeight: false,
                groupHeight: false,
                allGroups: this
            }, options);

            initResult = this.each(function(){

                var $this = $(this),
                    data = $this.data('miGrouping');

                // If the plugin hasn't been initialized yet
                if ( !data ) {
                    var container   = $this,
                        groups      = container.children('.'+options.groupClass),
                        titlebars   = groups.children('.'+options.titlebarClass),
                        contents    = groups.children('.'+options.contentClass);

                    $(this).data('miGrouping', {
                        container : container,
                        groups    : container.children('.'+options.groupClass),
                        titlebars : groups.children('.'+options.titlebarClass),
                        contents  : groups.children('.'+options.contentClass),
                        options   : options
                    });

                    data = $this.data('miGrouping');
                }

                if (data.options.beforeInit) {
                    data.options.beforeInit($this);
                }

                data.titlebars.click(function(){
                    indexToOpen = data.titlebars.index($(this));
                    data.options.activate = indexToOpen;
                    if (data.options.changeAll) {
                        data.options.allGroups.miGrouping('activate', data.options);
                    } else {
                        $this.miGrouping('activate', data.options);
                    }

                    if (data.options.scrollInView) {
                        currentAnchor = $(this).parent().find('.'+options.scrollClass);
                        if (!currentAnchor || typeof currentAnchor === undefined || currentAnchor.length <= 0) {
                            currentAnchor = $(this);
                        }
                        if (currentAnchor && typeof currentAnchor !== undefined && currentAnchor.length > 0) {
                            var topOffset = currentAnchor.offset();
                            topOffset = topOffset.top;
                            $(window).scrollTop(topOffset);
                        }
                    }
                });

                if (data.options.afterInit) {
                    data.options.afterInit($this);
                }

                if (data.options.activate !== false) {
                    if (data.options.changeAll === false) {
                        //Open each group after initialization
                        $this.miGrouping('activate', data.options);
                    }
                }

            });

            if (options.activate !== false) {
                if (options.changeAll === true) {
                    //Open all initialized groups together after initialization
                    options.allGroups.miGrouping('activate', options);
                }
            }

            options.allGroups.miGrouping('initHeight', options);

            return initResult;
        },
        activate : function( newValues ) {

            activateResult = this.each(function(){
                var $this = $(this),
                    data = $this.data('miGrouping');

                if (data) {

                    data.options.activate = newValues.activate;
                    if (data.options.ajaxContent) {
                        ajaxUrlFields = data.contents.eq(data.options.activate).find('.'+data.options.ajaxUrlClass);
                        if (ajaxUrlFields.length > 0) {
                            ajaxUrlFields.each(function(){
                                ajaxUrl = $(this).val();
                                contentField = $(this).parent();
                                $.ajax({
                                    url: ajaxUrl,
                                    async: false
                                }).done(function(data) {
                                    contentField.html(data);
                                });
                            });
                        }
                    }

                    if (data.options.beforeOpen) {
                        data.options.beforeOpen(data.titlebars.eq(data.options.activate), data.contents.eq(data.options.activate), data.options.activate);
                    }

                    data.contents.not(data.options.activate).hide();
                    data.contents.eq(data.options.activate).show();

                    if (data.options.afterOpen) {
                        data.options.afterOpen(data.titlebars.eq(data.options.activate), data.contents.eq(data.options.activate), data.options.activate);
                    }
                }
            });

            return activateResult;
        },
        setGroupHeight : function() {
            this.each(function(){
                var $this = $(this),
                    data = $this.data('miGrouping');

                if (data) {
                    data.contents.eq(data.options.activate).height(data.options.groupHeight);
                }
            });
        },
        initHeight : function( options ) {
            if (data.options.setGroupHeights) {
                groupHeights = {};
                initHeightResult = this.each(function(){
                    var $this = $(this),
                        data = $this.data('miGrouping');

                    if (data.options.changeAll) {
                        if (data) {
                            data.contents.each(function(){
                                if(data.options.equalGroupHeight) {
                                    if (!groupHeights[data.contents.index($(this))] || groupHeights[data.contents.index($(this))] < $(this).height()) {
                                        groupHeights[data.contents.index($(this))] = $(this).height();
                                    }
                                }
                            });
                        }
                    }
                });

                $.each(groupHeights, function(groupIndex, groupHeight) {
                    options.groupHeight = groupHeight;
                    options.activate = groupIndex;
                    options.allGroups.miGrouping('setGroupHeight', options);
                });
            } else {
                initHeightResult = null;
            }

            return initHeightResult;
        }
    };

    $.fn.miGrouping = function( method ) {
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.miGrouping' );
        }
    };

})( jQuery );
