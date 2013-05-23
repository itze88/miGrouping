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
                    allGroups: this
                }, options);

            return this.each(function(){

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
                    if (data.options.changeAll) {
                        data.options.allGroups.miGrouping('activate', {
                            activate: indexToOpen
                        });
                    } else {
                        $this.miGrouping('activate', {
                            activate: indexToOpen
                        });
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
                    $this.miGrouping('activate', {
                        activate: data.options.activate
                    });
                }
            });
        },
        activate : function( newValues ) {

            return this.each(function(){
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

