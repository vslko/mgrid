/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);

/**
* jQuery mantellaGrid Plugin v2.0.0
* Copyrights Vasilij Olhov, 2014.
* Licensed under the MIT licenses (http://www.opensource.org/licenses/mit-license.php)
**/

;(function($) {


    var defaults = {
                     title        : " ",
                     recInPage    : 50,
                     url          : {
                                         fetch:'./items/',
                                         /* Services variables in request:
                                                _sord: sorting order (asc/desc),
                                                _scol: sorting column name (column.attr)
                                                _page: number of page (1..)
                                                _recs: records in page (1..);
                                                _group: ID of group (if groupped=true )
                                                _uncache: random number
                                             Variables in response
                                                fields by columns definition
                                                _groups: array of group ids (if groupped=true )
                                          */

                                         add:'./items/add',
                                          /* Services variables in request:
                                                fields from add-form
                                                _group: ID of group or 'not'/'all' for item without group (if groupped=true )
                                             Variables in response
                                                 fields by columns definition
                                                 _groups: array of group ids (if groupped=true )
                                          */

                                         update:'./items/update',
                                          /* Services variables in request:
                                                 fields from update-form
                                                 _group: ID of group or 'not'/'all' for item without group (if groupped is true)
                                             Variables in response
                                                fields by column definition
                                                 _groups: array of group ids (if groupped=true )
                                          */

                                         remove:'./items/remove'
                                          /* Services variables in request:
                                                fields from remove-form (ussualy only id of item)
                                                 _group: ID of group or 'not'/'all' for item without group (if groupped=true )
                                             Variables in response
                                                 id of deleted item (repeat from request)
                                          */
                     },
                     forms        : {
                                         add        : $('<div>Add-Form not defined</div>'),
                                         update    : $('<div>Update-Form not defined</div>'),
                                         remove    : $('<div>Remove-form not defined</div>')
                     },
                     columns      : [  // { attr:str , view:str , width:int , hidden:bool , filtered:bool , pkey:bool, cls:string , render: function(value) { return value; } }
                                       { attr:'id'  , view:'ID'  , hidden:false, filtered:true, width:75, pkey:true },
                                       { attr:'name', view:'Name', hidden:false, filtered:true  }
                     ],
                     callback     : {
                                         onAction  : null, // function(action, data) { return true/false; }
                                         onSubmit  : null, // function(action, data) { return true/false; }
                                         onSuccess : null, // function(action, data, message) { }
                                         onSelect  : null, // function( data ) { return true/false; }
                                         onError   : null  // function(action, errorMessage) { }
                     },
                     extraParams  : {},
                     locale       : {
                                      progress              : 'processing..',
                                      cancel_button       : 'Cancel',
                                      add_button          : 'Add',
                                      update_button       : 'Save',
                                      remove_button       : 'Remove',
                                      clear_button        : 'Clear',
                                      add_record          : 'Add new item',
                                      update_record       : 'Update selected item',
                                      remove_record       : 'Remove selected item',
                                      move_record         : 'Move items on drag-n-drop into groups',
                                      copy_record         : 'Copy items on drag-n-drop into groups',
                                      empty_result        : 'No items to view',
                                      found_result             : 'Found {total} items',
                                      result              : 'View {from}-{to} of {total}, page {page}/{pages}',
                                      select_page         : 'Page {num}',
                                      add_caption         : 'Add new item',
                                      update_caption      : 'Modify {name}',
                                      remove_caption      : 'Remove {name}',
                                      group_name          : 'Group',
                                      out_of_group        : 'Without group items',
                                      all_items                : 'All items',
                                      group_add_record    : 'Add new group',
                                      group_update_record : 'Rename selected group',
                                      group_remove_record : 'Remove selected group',
                                      group_clear         : 'Remove all items from group',
                                      group_add_caption   : 'Add new group',
                                      group_update_caption: 'Rename group {name}',
                                      group_remove_caption: 'Remove group {name}',
                                      group_clear_caption : 'Clear group {name}',
                                      group_remove_confirm: 'Do you want remove this group?',
                                      group_clear_confirm : 'Do you want clear items from group?'
                     },
                     groupped    : false,
                     groups      : {
                                      width    : 200,
                                      title    : 'Groups',
                                      url      : {
                                                      fetch    :'./groups/',
                                                      add        :'./groups/add',
                                                      update    :'./groups/update',
                                                      remove    :'./groups/remove',
                                                      copy    :'./items/copy',
                                                      move    :'./items/move',
                                                      clear    :'./groups/clear'
                                      },
                                      callback : {
                                                      onSelect  : null, // function( data ) { return true/false; }
                                                      onAction  : null, // function( action, data ) { return true/false; }
                                                      onSubmit  : null, // function( action, data ) { return true/false; }
                                                      onSuccess : null, // function( action, data, message) { }
                                                      onError   : null  // function(action, errorMessage) { }
                                      }
                     }
    };

    var opts;







    /*
    * =================================================
    * =============== EXTERNAL METHODS =================
    * ================================================
    */
    var methods = {

           // === Initailization ===
        init: function(params) {

            // ----- Extend options -----
            opts = $.extend(true, {}, defaults, params);
            this.data('opts',opts);

               // ----- Add grids -----
               var groupsGrid = $('<div class="mgrid mgrid-border mgrid-groups" style="float:left;"></div>').appendTo(this);
            var itemsGrid     = $('<div class="mgrid mgrid-border" style="float:left;"></div>').appendTo(this);


            // --- Groups Grid ---
            if ( opts.groupped ) {
                groupsGrid.width(opts.groups.width);
                buildGroupsGrid.call(groupsGrid);
            }
            else { groupsGrid.addClass('mgrid-groups-cleaner'); }
            this.data('groups', { grid:groupsGrid } );

            // --- Items Grid ---
            var pkey = buildItemsGrid.call(itemsGrid);
            this.data('items',  { grid : itemsGrid,
                                  pkey : pkey,
                                  conditions: { sort_column:'', sort_order:'asc', page:1 },
                                  dragged_column: false,
                                  dragged_item: false
                                }
            );

            // --- Prepare items popup windows ---
            var form;

            this.append( getActionWindowContent.call(this, 'add') );
            form = this.find('div.mgrid-add-window > div.mgrid-window-body');
            opts.forms.add.clone(true).appendTo( form );
            opts.forms.add.remove();

            this.append( getActionWindowContent.call(this, 'update') );
            form = this.find('div.mgrid-update-window > div.mgrid-window-body');
            opts.forms.update.clone(true).appendTo( form );
            opts.forms.update.remove();

            this.append( getActionWindowContent.call(this, 'remove') );
            form = this.find('div.mgrid-remove-window > div.mgrid-window-body');
            opts.forms.remove.clone(true).appendTo( form );
            opts.forms.remove.remove();

            // --- Prepare groups popup windows ---
            if ( opts.groupped ) {
                this.append( getActionWindowContent.call(this,'group_add') );
                form = this.find('div.mgrid-group_add-window > div.mgrid-window-body');
                form.append('<input type="hidden" name="id" value=""><label for="name">'+opts.locale.group_name+'</label><input type="text" maxlength="50" name="name" value="" /><br />' );

                this.append( getActionWindowContent.call(this,'group_update') );
                form = this.find('div.mgrid-group_update-window > div.mgrid-window-body');
                form.append('<input type="hidden" name="id" value=""><label for="name">'+opts.locale.group_name+'</label><input type="text" maxlength="50" name="name" value="" /><br />' );

                this.append( getActionWindowContent.call(this,'group_remove') );
                form = this.find('div.mgrid-group_remove-window > div.mgrid-window-body');
                form.append('<input type="hidden" name="id" value="">'+opts.locale.group_remove_confirm );

                this.append( getActionWindowContent.call(this,'group_clear') );
                form = this.find('div.mgrid-group_clear-window > div.mgrid-window-body');
                form.append('<input type="hidden" name="id" value="">'+opts.locale.group_clear_confirm );
            }

            // --- Prepare progress-bar layer ---
            this.append('<div class="mgrid-progressbar mgrid-border"><span class="mgrid-border">'+opts.locale.progress+'</span></div>');

            // --- Prepare overlay layer ---
            this.append('<div class="mgrid-overlay"></div>');
            // --- bind default actions on buttons ---
            bindActions.call(this, itemsGrid, groupsGrid);
            // --- resize grids in wrapper div sizes ---
            reDraw.call(this);

            return this;
        },


        // === Return extra parameters of grid ---
        getExtraParams : function() {
            var opts = this.data('opts');
            return opts.extraParams;
        },

        // === Set new extra parameters into grid ---
        setExtraParams : function( extraParams ) {
            var opts = this.data('opts');
            opts.extraParams = extraParams;
            this.data('opts',opts);

            return this;
        },


        // === Load from server items and fill grid ===
        fetchItems : function( extraParams ) {
             var opts = this.data('opts');
             opts.extraParams = extraParams;
             this.data('opts',opts);
             doItemsRequest.call(this, "fetch", null );

             return this;
        },

        // === Clear items from grid ===
        clearItems : function() {
            methods.setTitle.call( this, this.data('opts').title );
            buildItemsList.call(this, {} );
            return this;
        },

        selectedItem: function() {
            var item = this.data('items').grid.find('div.mgrid-content tr.mgrid-selected-item').first();
            return (item.length) ? item.data('raw') : false;
        },

        // === Clear items from grid ===
        selectedGroup: function() {
            var item = this.data('groups').grid.find('div.mgrid-content div.mgrid-selected-group').first();
            return (item.length) ? item.data('raw') : false;
        },

        // === Search item by primary key and return its data in json
        getItem: function( pkey ) {
            var item = this.data('items').grid.find('div.mgrid-content tr[for="'+pkey+'"]');
            return item.length ? item.data("raw") : false;
        },

        // === Return all items data in json format ===
        getItems: function() {
           var items = []
           this.data('items').grid.find('div.mgrid-content tr').each( function() {
               items.push( $(this).data('raw') );
           });
           return items;
        },

        // === set new title of items grid ===
        setTitle : function( title ) {
            this.data('items').grid
                .find('div.mgrid-title').first()
                .html( title );

            return this;
        },

        // === Load from server groups and fill grid ===
        fetchGroups : function( extraParams ) {
            doGroupsRequest.call(this, "fetch", extraParams );

            return this;
        },


        // === Load from server items or groups in case of groupped condition ===
        fetch        : function( extraParams ) {
            var opts = this.data('opts');
            if (opts.groupped) { methods.fetchGroups.call(this, extraParams); }
            else { methods.fetchItems.call(this, extraParams); }

            return this;
        }

    };










    /*
    * =================================================
    * ============= ITEMS AJAX FUNCTIONS ==============
    * =================================================
    */
    var doItemsRequest = function(request, data ) {
        var me = this,
            items = me.data('items'),
            opts = me.data('opts');

        data =  $.extend( data, opts.extraParams );  // add extra parameters if exists

        if ( request == "fetch" ) { // add services parameters into request
               data =  $.extend({  // add pagination and uncached value
                                   _page      : items.conditions.page,
                                   _recs      : opts.recInPage,
                                   _uncache : Math.floor((Math.random()*10000)+1)
                                }, data);
               if ( items.conditions.sort_column) { // if sorting is ON
                   data = $.extend({
                                      _scol : items.conditions.sort_column,
                                      _sord : items.conditions.sort_order
                                   }, data);
               }
        }
        else {
            if ( opts.extraParams._group !== undefined) {
                data =  $.extend({}, true, { _group : opts.extraParams._group }, data);
            }
        }

        setProgress.call(me); // show progress-bar
        $.ajax({
            type:        ((request=="fetch") ? "GET" : "POST"),
            url:         opts.url[request],
            dataType:    "json",
            data:        data,
            complete:     function() { setProgress.call(me); /* show progress-bar */},
            success:     function(response) {
                            if ( !response.success ) {
                                    if(opts.callback.onError) { opts.callback.onError.call( me, request, response.message ); }
                                  return;
                             }
                             itemsRequestHandler[request].call( me, response );
            },
            error :           function( xhr, status, error ) {
                             if(opts.callback.onError) {
                                 opts.callback.onError.call( me, request, error );
                             }
              }
           });

       };


    var itemsRequestHandler = {

           fetch    : function( resp ) {
                     buildItemsList.call( this, resp.data.items );
                     buildItemsPages.call( this,
                                            {  page      : resp.data.page,
                                                 total   : resp.data.total,
                                                 records : resp.data.items.length });
                     reDraw.call(this);
                     itemsRequestHandler._callback.call( this , "fetch", resp );
          },

        add        : function( resp ) {
                     addItemIntoList.call( this, resp.data , true );
                     itemsRequestHandler._callback.call(this, "add", resp );
        },

        update    : function( resp ) {
                     updateItemInList.call( this, resp.data );
                     itemsRequestHandler._callback.call(this, "update", resp );
           },

           remove    : function( resp ) {
                     removeItemFromList.call(this, resp.data );
                     itemsRequestHandler._callback.call(this, "remove", resp );
           },

           _callback: function( action , resp ) {
                         var opts = this.data('opts');
                      if (opts.callback.onSuccess) { opts.callback.onSuccess.call( this, action, resp.data, resp.message );  }
                      closeWindow.call(this);
           }

    };






    /*
    * =================================================
    * =============== GROUPS AJAX FUNCTIONS ===========
    * =================================================
    */
    var doGroupsRequest = function(request, data ) {
        var me = this,
            items = me.data('items'),
            opts = me.data('opts');

         if (request=="fetch") { data =  $.extend( { _uncache:Math.floor((Math.random()*10000)+1) }, data); }

        setProgress.call(me); // show progress-bar
        $.ajax({
                 type:        ((request=="fetch") ? "GET" : "POST"),
                 url:         opts.groups.url[request],
                 dataType:    "json",
                 data:        data,
                 complete:     function() { setProgress.call(me); /* show progress-bar */},
                 success:     function(response) {
                                   if ( !response.success ) {
                                        if( opts.groups.callback.onError ) { opts.groups.callback.onError.call( me, request, response.message ); }
                                      return;
                                  }
                                  groupsRequestHandler[request].call( me, response );
                 },
                 error :      function( xhr, status, error ) {
                                   if(opts.groups.callback.onError) { opts.groups.callback.onError.call( me, request, error ); }
                               }
            });

        };


    var groupsRequestHandler = {

            fetch    : function( resp ) {
                          buildGroupsList.call(this, resp.data);
                        groupsRequestHandler._callback.call( this , "fetch", resp );
            },


            add        : function( resp ) {
                         addGroupIntoList.call(this, resp.data , true );
                          groupsRequestHandler._callback.call( this, 'add', resp ) ;
            },

            update    : function( resp ) {
                        updateGroupInList.call(this, resp.data );
                           groupsRequestHandler._callback.call( this, 'update', resp ) ;
            },

            remove    : function( resp ) {
                        removeGroupFromList.call(this, resp.data );
                        groupsRequestHandler._callback.call( this, 'remove', resp ) ;
            },

            clear    : function( resp ) {
                           clearGroupInList.call(this, resp.data );
                           groupsRequestHandler._callback.call( this, 'clear', resp ) ;
            },

            copy    : function( resp ) {
                          if ( resp.data.out_groups.length ) {
                              hideItemFromList.call(this, resp.data.item_id );
                              changeGroupItemsCount.call(this, resp.data.out_groups, -1 );
                          }
                          changeGroupItemsCount.call(this, [resp.data.dst_id], 1 );
                          groupsRequestHandler._callback.call(this, 'copy', resp ) ;
            },

            move    : function( resp ) {
                        hideItemFromList.call(this, resp.data.item_id );
                        changeGroupItemsCount.call(this, [resp.data.dst_id], 1 );
                        changeGroupItemsCount.call(this, resp.data.out_groups, -1 );
                        groupsRequestHandler._callback.call(this, 'move', resp ) ;
            },

            _callback: function( action, resp ) {
                var opts = this.data('opts');
                if (opts.groups.callback.onSuccess) { opts.groups.callback.onSuccess.call( this, action, resp.data, resp.message );  }
                closeWindow.call(this);
            }

        };











    /*
    * =================================================
    * =============== HELPER FUNCTIONS ================
    * =================================================
    */

    // === Escape specific symbols ===
    var escapeHtml = function( html, onlyQuotes ) {
            if (!html) { return ''; }
            return (onlyQuotes) ? html.replace( new RegExp('"','ig') , '&quot;')
                                : html.replace( /&/g, "&amp;")
                                        .replace( /</g, "&lt;")
                                        .replace( />/g, "&gt;");
    };








    /*
    * =================================================
    * ============= INTERFACE FUNCTIONS  ==============
    * =================================================
    */

    // === Recalculate widths and heights of grids and its elements ===
    var reDraw = function() {
        var h,
            itemsGrid          = this.data('items').grid,
            groupsGrid         = this.data('groups').grid,
            itemsContent     = itemsGrid.find('div.mgrid-content').first(),
            itemsHeader        = itemsGrid.find('div.mgrid-header').first(),
            groupsContent    = groupsGrid.find('div.mgrid-content').first(),
            progressBar        = this.find('div.mgrid-progressbar').first();

        // set heights of lists
        itemsGrid.height( this.height() - (itemsGrid.outerHeight(true)-itemsGrid.height()) );
        groupsGrid.height( this.height() - (groupsGrid.outerHeight(true)-groupsGrid.height()) )

        // set height and width of progress-indicator layer
        progressBar.height( this.height() - ( progressBar.outerHeight(true) - progressBar.height() ) )
                   .width( this.width() - ( progressBar.outerWidth(true) - progressBar.width() ) )
                   .css( 'line-height', this.height() - ( progressBar.outerHeight(true) - progressBar.height() ) + 'px' )

        // set width of itemsList
        itemsGrid.width( this.width() - groupsGrid.outerWidth(true) - (itemsGrid.outerWidth(true)-itemsGrid.width()) );

        // set height of content
        h = 0;
        itemsGrid.children('div:not(.mgrid-content):visible').each( function(i, item) { h += $(this).outerHeight(true); });
        itemsContent.height( (itemsGrid.height()-h) );

        h = 0;
        groupsGrid.children('div:not(.mgrid-content):visible').each( function(i, item) { h += $(this).outerHeight(true); });
        groupsContent.height( (groupsGrid.height()-h) );

        // set width of header
        itemsHeader.width( itemsContent.get(0).clientWidth );

        // resize all cells as headers of columns
        var last = itemsHeader.find('th').length - 1;
        itemsHeader.find('th').each( function(i,o) {
            if (i < last) {
                itemsContent.find('td[for="' + $(this).attr('for') + '"]').first().width( $(this).width() );
            }
        });

    };


    // === Return html-markup for popup-window ( what = add/update/remove/group_add/group_update/group_remove/group_clear)
    var getActionWindowContent = function( what ) {
            var template =  '<div class="mgrid-window mgrid-{ACTION}-window">' +
                                '<div class="mgrid-window-header mgrid-header-bg mgrid-border">' +
                                         '<span class="mgrid-window-title">{CAPTION}</span>' +
                                   '<span class="mgrid-window-close"></span>' +
                              '</div>' +
                              '<div class="mgrid-window-body" for="{ACTION}"></div>' +
                               '<div class="mgrid-window-buttons">' +
                                 '<div class="mgrid-window-button mgrid-window-button-{ACTION} mgrid-window-button-action">{BUTTON}</div>' +
                                 '<div class="mgrid-window-button mgrid-window-button-cancel">'+opts.locale.cancel_button+'</div>' +
                               '</div>' +
                                 '</div>';
            var content = template.replace( /\{ACTION\}/gi, what )
                                  .replace( /\{CAPTION\}/gi, opts.locale[what+'_caption'].replace(/\{(\S*)\}/gi, '<data prop="$1"></data>' ) )
                                  .replace( /\{BUTTON\}/gi, opts.locale[ what.replace(/group_/,'') + '_button'] )
            return content;
    };


    // === calculate and set popup window to center of widget. (this = wrapper) ===
    var setWindowPosition = function(win) {
        var winW    = win.outerWidth(true),
            winH    = win.outerHeight(true),
            gridPos    = this.offset(),
            gridW    = this.outerWidth(true),
            gridH    = this.outerHeight(true);

        win.css('left'    ,    ( (winW >= gridW) ? gridPos.left : Math.ceil( (gridW-winW) / 2 ) + gridPos.left ) )
           .css('top'    ,    ( (winH >= gridH) ? gridPos.top  : Math.ceil( (gridH-winH) / 2 ) + gridPos.top ) );

        return win;
    };


    // === close visible window and reset form inside it (this = wrapper) ===
    var closeWindow = function() {
        var win  = this.find('div.mgrid-window:visible').first(),
            body = win.children('div.mgrid-window-body').first(),
            opts = this.data('opts');

           this.find('div.mgrid-overlay').first().fadeOut(100);
           win.fadeOut(100,
                       function() { // erase fields
                           for(var i=0; i<opts.columns.length; i++) {
                              body.find('[name="'+opts.columns[i].attr+'"]').each( function() {
                                  $(this).val( $(this).attr('value') );
                              });
                          }
                    }
        );
    };

    // === fill form inside window with data  ===
    var fillWindowWithData = function( win, data ) {
        for(var name in data) {
            win.find('data[prop="'+name+'"]').html( data[name] );
         }
         for(var name in data) {
               win.find('[name="'+name+'"]').first().val( data[name] );
         }
    };

    // --- Scroll ro row in list and margue it
    var alertRow = function(row, scroll, margue ) {
        if (scroll) {
            row.parents('.mgrid-content').first().scrollTo( row );
        }
        if (margue) {
            row.fadeTo( 100,
                        0.3,
                        function() {
                            $(this).fadeTo( 750,
                                            1,
                                            function() { $(this).show(); }
                            );
                        }
            );
        }

     };

     // On mouseover item -> attent to group, in which item is included
     var showRelatedGroups = function( groups ) {
         var groupsGrid = this.data('groups').grid;
         groupsGrid.find('.mgrid-content div.mgrid-group-row').removeClass('mgrid-item-inside');
         if (groups) {
            for(var i=0; i<groups.length; i++) {
                groupsGrid.find('.mgrid-content div.mgrid-group-row[for="'+groups[i]+'"]').addClass('mgrid-item-inside');
            }
         }
     }

     // Show/hide progress panel
     var setProgress = function() {
         var progressBar = this.find('div.mgrid-progressbar').first();
         if ( progressBar.is(":hidden") ) { progressBar.show(); }
         else { progressBar.hide(); }
     }






    /*
    * =================================================
    * ============ ITEMS BUILD FUNCTIONS ==============
    * =================================================
    */

    // === Insert all blocks for Items Grid. this object is itemsGrid ===
    var buildItemsGrid = function() {
            var primary_key = null;

            // --- title ---
            if (opts.title) { this.append('<div class="mgrid-border mgrid-title mgrid-header-bg">'+opts.title+'</div>'); }

            // --- headers ---
            var column, columns, isFiltered = false;
            this.append('<div class="mgrid-header"><table style="width:100%; border:0;" cellspacing="0" cellpadding="0" border="0"></table></div>');
             columns = '<tr>';
             for(var i=0; i<opts.columns.length; i++) {
                 column = opts.columns[i];
                 if ( !column.hidden ) {
                     columns += '<th class="mgrid-caption-bg" for="'+column.attr+'" ' + ((column.width) ? 'style="width:'+parseInt(column.width)+'px;"': '' ) + '>' +
                                '<span class="mgrid-column-resizer"> </span><div class="mgrid-column-name">'+column.view+'</div></th>';
                     if (column.filtered) { isFiltered = true; }
                 }
                 if (column.pkey) { primary_key = column.attr; }
             }
             columns += '</tr>';

            // --- subheaders: filter-panel ---
            if (isFiltered) {
                columns += '<tr>';
                for(var i=0; i<opts.columns.length; i++) {
                     column = opts.columns[i];
                     columns += (!column.hidden)  ?  ('<td>' + (column.filtered ? '<input for="'+column.attr+'" type="text" />' : '&nbsp;') + '</td>')  :  '';
                 }
                columns += '</tr>';
            }
            this.find('div.mgrid-header table').first().append(columns);

            // --- content ---
            this.append('<div class="mgrid-content" style="height:20px; text-align:center;"><table style="width:100%; border:0;" cellspacing="0" cellpadding="0" border="0"><tbody></tbody></table></div>');

            // --- footer ---
            this.append('<div class="mgrid-footer mgrid-border mgrid-caption-bg"><table height="100%" width="100%" cellspacing="0" cellpadding="0" border="0"></table></div>');
            columns = '<tr>' +
                          '<td width="33%" valign="middle" align="left" class="mgrid-actions-panel">'+
                            '<div title="'+opts.locale.add_record+'" class="mgrid-button mgrid-button-add"></div>' +
                            '<div title="'+opts.locale.update_record+'" class="mgrid-button mgrid-button-update"></div>' +
                            '<div title="'+opts.locale.remove_record+'" class="mgrid-button mgrid-button-remove"></div>' +
                            ( opts.groupped ? ( '<div class="mgrid-delimeter"></div>' +
                                                '<div title="'+opts.locale.move_record+'" class="mgrid-button mgrid-button-move active"></div>' +
                                                '<div title="'+opts.locale.copy_record+'" class="mgrid-button mgrid-button-copy"></div>' )
                                            : '' ) +
                        '</td>' +
                        '<td width="34%" valign="middle" align="center" class="mgrid-pages-control">' +
                            '<span class="mgrid-button mgrid-pages-selector-prev">&nbsp;&nbsp;</span>' +
                            '<select class="mgrid-pages-selector"></select>' +
                            '<span class="mgrid-button mgrid-pages-selector-next">&nbsp;&nbsp;</span>' +
                        '</td>' +
                        '<td width="33%" valign="middle" align="right" class="mgrid-pages-panel">&nbsp;</td></tr>';
            this.find('div.mgrid-footer table').first().append(columns);

            return primary_key;
    };


    // === Define elements of pages navigation panel; (this=wrapper) ===
    var buildItemsPages = function( data ) { // data {page:int, total:int, records:[array of objects]
        var conditions = this.data('items').conditions,
            itemsGrid  = this.data('items').grid,
            opts       = this.data('opts');
            pageInfo   = itemsGrid.find('.mgrid-pages-panel'),
            pageCtrl   = itemsGrid.find('.mgrid-pages-control'),
            pageSelect = itemsGrid.find('select.mgrid-pages-selector');


        if ( data.total == 0 ) {
            pageInfo.html(opts.locale.empty_result);

               itemsGrid.find(".mgrid-pages-selector-prev").css('display', 'none');
               itemsGrid.find(".mgrid-pages-selector-next").css('display', 'none');
               pageSelect.hide();
               return;
           }

        if ( !opts.recInPage || data.total <= opts.recInPage ) {
             var txt = opts.locale.found_result
                           .replace(/\{total\}/gi, data.total);
             pageInfo.html(txt);

               itemsGrid.find(".mgrid-pages-selector-prev").css('display', 'none');
               itemsGrid.find(".mgrid-pages-selector-next").css('display', 'none');
               pageSelect.hide();
               return;
        }

        pageSelect.show();
        itemsGrid.find(".mgrid-pages-selector-prev").css('display', 'inline-block');
        itemsGrid.find(".mgrid-pages-selector-next").css('display', 'inline-block');
           var txt,
               from  = parseInt( ( (data.page-1) * opts.recInPage ) + 1 ),
                  to       = from + data.records - 1,
               pages = Math.ceil(data.total / opts.recInPage);

           txt = opts.locale.result
                     .replace(/\{from\}/gi, from)
                     .replace(/\{to\}/gi, to )
                     .replace(/\{total\}/gi, data.total)
                     .replace(/\{page\}/gi, data.page )
                     .replace(/\{pages\}/gi, pages );
        pageInfo.html(txt);

        pageSelect.empty().show();
        for (var i=1; i<=pages; i++) {
            pageSelect.append( '<option value="'+i+'" '+ ( (i == conditions.page) ? 'selected' : '') + '>' + opts.locale.select_page.replace(/\{num\}/gi, i ) + '</option>' );
           }

    };


    // === Create and return Table of items ===
    var buildItemsList = function( itemsList ) {
        // clear list
        this.data('items').grid
            .find('div.mgrid-content > table > tbody').first()
            .find('tr').remove();

        // add items into list
        for(var i=0; i<itemsList.length; i++) {
               addItemIntoList.call(this, itemsList[i], false );
        }
    };


    // === Add row into list and set event on row ===
    var addItemIntoList = function( itemData , apply ) {
           var itemsGrid     = this.data('items').grid,
               opts          = this.data('opts'),
               rows          = itemsGrid.find('div.mgrid-content > table > tbody').first(),
               itemContent    = getItemContent.call(this, itemData );

        rows.append( itemContent );
        if (apply) {
            alertRow(itemContent, true, true);
               if (opts.groupped && itemData._groups !== undefined) {
                   changeGroupItemsCount.call(this, itemData._groups, 1 );
                changeGroupItemsCount.call(this, ['all'], 1 );
               }
        }
        setEventsForItem.call(this, itemContent );

        // if it's first row, then recalculate sizes
        if ( rows.find('tr').length == 1 ) { reDraw.call(this); }

    };


    // === Return tr-object of item' row ===
    var getItemContent = function( data ) {
        var opts     = this.data('opts'),
            items     = this.data('items'),
            content, col, txt;

        content = '<tr for="'+data[ items.pkey ]+'">';
        for(i=0; i<opts.columns.length; i++) {
            col = opts.columns[i];
            if (col.hidden) { continue; }
            if (data[col.attr] === undefined) { data[col.attr] = ''; }
            txt = ( col.render !== undefined) ? col.render.call( this, data[col.attr], data) : escapeHtml(data[col.attr], false);
            content += '<td ' + ( (col.cls) ? 'class="'+col.cls+'"' : '' ) +' ' +
                            'for="'+col.attr+'" ' +
                            'title="' + escapeHtml(data[col.attr],true) + '">' +
                            txt +
                             '</td>';

        }
        content += '</tr>';
        content = $(content);
        content.data('raw',data);
        return content;
    };

    // === Update item in list ===
    var updateItemInList = function( itemData ) {
        var items     = this.data('items'),
            rows     = items.grid.find('div.mgrid-content > table > tbody').first(),
            item     = getItemContent.call(this, itemData );

        rows.find('tr[for="'+itemData[items.pkey]+'"]').replaceWith( item );
        alertRow( item, false, true );
        setEventsForItem.call(this, item );

        // if it's first row, then recalculate sizes
        reDraw.call(this);
    };

    // === Remove item list ===
    var removeItemFromList = function( itemId ) {
        var opts      = this.data('opts'),
            item     = this.data('items').grid.find('.mgrid-content > table > tbody > tr[for="'+itemId+'"]'),
            itemData = item.data('raw');

        if (opts.groupped && itemData._groups !== undefined) {
            changeGroupItemsCount.call(this, itemData._groups, -1 );
            changeGroupItemsCount.call(this, ['all'], -1 );
        }
        item.remove();
        reDraw.call(this);
    }

    // === hide item fromlist without groups handling ===
    var hideItemFromList = function( itemId ) {
        this.data('items').grid
            .find('.mgrid-content > table > tbody > tr[for="'+itemId+'"]')
            .remove();
           reDraw.call(this);
       }


    // === move item into new group and remove from old ===
    var moveItemIntoGroup = function( item, group ) {
        var groupsGrid     = this.data('groups').grid;
            fromGroup     = groupsGrid.find('div.mgrid-content div.mgrid-selected-group').first(),
            fromGroupId = fromGroup.attr('for'),
            intoGroupId = group.attr('for'),
            itemId         = item.attr('for');

        if ( fromGroupId == intoGroupId ) { return false; }
        if ( $.inArray(intoGroupId, item.data('raw')._groups ) > -1) { return false; }

        doGroupsRequest.call( this,
                               'move',
                               {
                                   src_id : fromGroupId,
                                   dst_id : intoGroupId,
                                   item_id: itemId
                               }
        );
    };


    // === copy item between groups ===
    var copyItemIntoGroup = function( item, group ) {
        var groupsGrid     = this.data('groups').grid;
            fromGroup     = groupsGrid.find('div.mgrid-content div.mgrid-selected-group').first(),
            fromGroupId = fromGroup.attr('for'),
            intoGroupId = group.attr('for'),
            itemId         = item.attr('for');

        if ( fromGroupId == intoGroupId ) { return false; }
        if ( $.inArray(intoGroupId, item.data('raw')._groups) > -1) { return false; }

        doGroupsRequest.call( this,
                              'copy',
                              {
                                  src_id : fromGroupId,
                                dst_id : intoGroupId,
                                item_id: itemId
                              }
        );
    };









    /*
    * =================================================
    * ============== ITEMS POPUP WINDOWS ==============
    * =================================================
    */
    var showAddItemWindow = function() {
        var opts = this.data('opts'),
            win = this.children('div.mgrid-add-window').first();
               acceptable = true;

        if (opts.callback.onAction) { acceptable = opts.callback.onAction.call( this, 'add', {} ); }
        if (!acceptable) { return false; }

        this.find('div.mgrid-overlay').first().fadeIn(200);
        setWindowPosition.call(this, win).show();
    };


    var showUpdateItemWindow = function() {
        var opts      = this.data('opts'),
            items      = this.data('items'),
            selected = items.grid.find('div.mgrid-content tr.mgrid-selected-item').first(),
            acceptable = true;

        if (!selected.length) { return false; }

        var    itemData = selected.data('raw'),
            win       = this.children('div.mgrid-update-window').first();

        if (opts.callback.onAction) { acceptable = opts.callback.onAction.call( this, 'update', itemData ); }
        if (!acceptable) { return false; }

        this.find('div.mgrid-overlay').first().fadeIn(200);
        fillWindowWithData(win, itemData);
        setWindowPosition.call(this, win).show();
    };


    var showRemoveItemWindow = function() {
         var opts      = this.data('opts'),
             items      = this.data('items'),
             selected = items.grid.find('div.mgrid-content tr.mgrid-selected-item').first(),
            acceptable = true;

        if (!selected.length) { return false; }

        var    itemData = selected.data('raw'),
            win       = this.children('div.mgrid-remove-window').first();

           if (opts.callback.onAction) { acceptable = opts.callback.onAction.call( this, 'remove', itemData ); }
           if (!acceptable) { return false; }

        this.find('div.mgrid-overlay').first().fadeIn(200);
        fillWindowWithData(win, itemData);
           setWindowPosition.call(this,win).show();
    };













    /*
    * =================================================
    * ============ GROUPS BUILD FUNCTIONS =============
    * =================================================
    */

    // === Insert all blocks for Groups Grid. (this) object is groupsGrid ===
    var buildGroupsGrid = function() {
        // --- title ---
        if (opts.groups.title) { this.append('<div class="mgrid-border mgrid-title mgrid-header-bg">'+opts.groups.title+'</div>'); }

        // --- content ---
        this.append('<div class="mgrid-content" style="height:20px;"></div>');

        // --- footer ---
        this.append('<div class="mgrid-footer mgrid-border mgrid-caption-bg"><table height="100%" width="100%" cellspacing="0" cellpadding="0" border="0"></table></div>');
        columns = '<tr>' +
                        '<td valign="middle" align="left" class="mgrid-actions-panel">'+
                           '<div title="'+opts.locale.group_add_record+'" class="mgrid-button mgrid-button-add"></div>' +
                           '<div title="'+opts.locale.group_update_record+'" class="mgrid-button mgrid-button-update"></div>' +
                           '<div title="'+opts.locale.group_remove_record+'" class="mgrid-button mgrid-button-remove"></div>' +
                       '</td>' +
                       '<td valign="middle" align="right" class="mgrid-actions-panel"><div title="'+opts.locale.group_clear+'" class="mgrid-button mgrid-button-clear"></div></td>' +
                     '</tr>';
        this.find('div.mgrid-footer table').first().append(columns);
    };


    // === Create and return list of groups, this=wrapper ===
    var buildGroupsList = function( groupsData ) {
        var total        = 0;
            opts         = this.data('opts'),
            groupsGrid   = this.data('groups').grid;

        table = groupsGrid.find('div.mgrid-content').first();
           table.children().remove();

        addGroupIntoList.call( this,
                               {  // default group for all items
                                  id   : 'all',
                                  name : opts.locale.all_items,
                                  items: groupsData.total
                                }
        );
        addGroupIntoList.call( this,
                               {  // default group for [items without group]
                                  id   : 'not',
                                  name : opts.locale.out_of_group,
                                  items : groupsData.without
                                }
        );

        // add groups if exists
        if ( groupsData.groups ) {	        for(var i=0; i<groupsData.groups.length; i++) { addGroupIntoList.call(this, groupsData.groups[i], false ); }
        }

        // set class for all-items group
        table.find('div[for="all"]').first().addClass('mgrid-group-allitems-group');

        // set items count without group and open it
        table.find('div[for="not"]').first().addClass('mgrid-group-without-group').click();
    };


    // === Add group into list and set event on it, this=wrapper===
    var addGroupIntoList = function( groupData , apply ) {
        var table = this.data('groups').grid.find('div.mgrid-content'),
            tmpl =     '<div for="'+groupData.id+'" class="mgrid-group-row" title="' + escapeHtml(groupData.name,true) + '">' +
                        '<div class="mgrid-group-name">' + escapeHtml(groupData.name,false) + '</div>' +
                           '<div class="mgrid-group-counter">' + groupData.items + '</div>' +
                           '<div class="clr"></div>' +
                        '</div>',
               group = $(tmpl);

        group.data('raw',groupData);
        table.append(group);

        if (apply) { alertRow( group, true, true ); }
        setEventsForGroup.call(this, group);
    };


    // === Update group in list ===
    var updateGroupInList = function( data ) {
        var groupsGrid = this.data('groups').grid,
            group = groupsGrid.find('div.mgrid-content div.mgrid-group-row[for="'+data.id+'"]');

        group.attr('title', escapeHtml( data.name , true ) )
                .data('raw', data )
                .find('.mgrid-group-name').html( escapeHtml( data.name,false) );
        alertRow( group, false, true );
    };


    // === Remove group from list, update counter on withput groups and select it ===
    var removeGroupFromList = function( data ) {
        var groupsGrid = this.data('groups').grid,
            group = groupsGrid.find('div.mgrid-content div.mgrid-group-row[for="'+data.id+'"]');

        group.remove();

        group = groupsGrid.find('div.mgrid-content div.mgrid-group-row[for="not"]');
        group.find('.mgrid-group-counter').html(data.without);
        group.click();
    };


    // === Clear items in group, set counter to 0 and update without group counter ===
    var clearGroupInList = function( data) {
        var groupsGrid = this.data('groups').grid,
            group = groupsGrid.find('div.mgrid-content > div.mgrid-group-row[for="'+data.id+'"]').first();

        groupsGrid.find('div.mgrid-content > div.mgrid-group-row[for="not"] > .mgrid-group-counter').html(data.without);
        group.find('.mgrid-group-counter').html('0');
        buildItemsList.call( this, {} );
    };


    // === change items count for groups in array ===
    var changeGroupItemsCount = function( groups, val ) {
        var groupsGrid = this.data('groups').grid,
            curr, field, counter;

        if (!groups) { groups = []; }
        if (groups.length==0) { groups.push("not"); }

           for(var i=0; i<groups.length; i++) {
            field = groupsGrid.find('div.mgrid-content > div.mgrid-group-row[for="'+groups[i]+'"]');
            counter = field.find('.mgrid-group-counter').first();

            curr = parseInt( counter.text() ) + val;
            counter.html(curr);
            var raw = field.data("raw");
            raw.items = curr;
            field.data("raw", raw);
        }
    };










    /*
    * =================================================
    * ============== GROUPS POPUP WINDOWS =============
    * =================================================
    */
    var showAddGroupWindow = function() {
         var opts = this.data('opts'),
               win = this.children('div.mgrid-group_add-window').first(),
               acceptable = true;

        if (opts.groups.callback.onAction) { acceptable = opts.groups.callback.onAction.call( this, 'add', {} ); }
        if (!acceptable) { return false; }

        this.find('div.mgrid-overlay').first().fadeIn(200);
        setWindowPosition.call(this, win).show();
   };

    var showUpdateGroupWindow = function() {
        var opts         = this.data('opts'),
            groupsGrid    = this.data('groups').grid,
            selected     = groupsGrid.find('div.mgrid-content div.mgrid-selected-group').first(),
               acceptable = true;

            if (!selected.length) { return false; }

            var    groupData = selected.data('raw'),
                win        = this.children('div.mgrid-group_update-window').first();

            if (opts.groups.callback.onAction) { acceptable = opts.groups.callback.onAction.call( this, 'update', groupData ); }
            if (!acceptable || !($.isNumeric(groupData.id)) ) { return false; }

            this.find('div.mgrid-overlay').first().fadeIn(200);
            fillWindowWithData(win, groupData);
            setWindowPosition.call(this, win).show();
    };

    var showRemoveGroupWindow = function() {
         var opts        = this.data('opts'),
             groupsGrid    = this.data('groups').grid,
             selected     = groupsGrid.find('div.mgrid-content div.mgrid-selected-group').first(),
               acceptable = true;

            if (!selected.length) { return false; }

            var    groupData = selected.data('raw'),
                win        = this.children('div.mgrid-group_remove-window').first();

            if (opts.groups.callback.onAction) { acceptable = opts.groups.callback.onAction.call( this, 'remove', groupData ); }
            if (!acceptable || !($.isNumeric(groupData.id)) ) { return false; }

            this.find('div.mgrid-overlay').first().fadeIn(200);
            fillWindowWithData(win, groupData);
            setWindowPosition.call(this,win).show();
    };

    var showClearGroupWindow = function() {
        var opts         = this.data('opts'),
            groupsGrid     = this.data('groups').grid,
            selected     = groupsGrid.find('div.mgrid-content div.mgrid-selected-group').first(),
               acceptable = true;

            if (!selected.length) { return false; }

            var    groupData = selected.data('raw'),
                win        = this.children('div.mgrid-group_clear-window').first();

            if (opts.groups.callback.onAction) { acceptable = opts.groups.callback.onAction.call( this, 'clear', groupData ); }
            if (!acceptable || !($.isNumeric(groupData.id)) ) { return false; }

            this.find('div.mgrid-overlay').first().fadeIn(200);
            fillWindowWithData(win, groupData);
            setWindowPosition.call(this,win).show();
    };




    /*
    * =================================================
    * ================ BIND ACTIONS ===================
    * =================================================
    */

    // === Bind Items & Group actions ===
    var bindActions = function( itemsGrid, groupsGrid ) {
        var me       = this,
            items = me.data('items');

        // ----- close popup window for items and groups -----
        me.find('.mgrid-window-close, .mgrid-window-button-cancel').on('click', function(event) {
            closeWindow.call(me);
        });

        // ----- submit request for items and groups------
        me.find('div.mgrid-window-button-action').on('click',  function (event) {
            var opts     = me.data('opts'),
                form      = $(this).parents('div.mgrid-window').first().find('div.mgrid-window-body').first(),
                action   = form.attr('for'),
                acceptable = true,
                data      = {},
                field;

            if ( action.indexOf("group_") === 0 ) { // group action
                data = { id      : form.find('input[name="id"]').first().val(),
                          name : form.find('input[name="name"]').first().val()
                };
                if ( opts.groups.callback.onSubmit ) { acceptable = opts.groups.callback.onSubmit.call( me, action.substring(6), data); }
                if (!acceptable) { return false; }
            }
            else { // item action
                for(var i=0; i<opts.columns.length; i++) {
                    field = form.find('[name="'+opts.columns[i].attr+'"]').first();
                    if (field.length && field.val()) { data[opts.columns[i].attr] = field.val(); }
                }
                if ( opts.callback.onSubmit ) { acceptable = opts.callback.onSubmit.call( me, action, data); }
                if (!acceptable) { return false; }
            }

            switch (action) {
                case 'add'             : doItemsRequest.call(me, 'add', data); break;
                case 'update'        : doItemsRequest.call(me, 'update', data); break;
                case 'remove'        : doItemsRequest.call(me, 'remove', data); break;
                case 'group_add'    : doGroupsRequest.call(me, 'add', data); break;
                case 'group_update'    : doGroupsRequest.call(me, 'update', data); break;
                case 'group_remove'    : doGroupsRequest.call(me, 'remove', data); break;
                case 'group_clear'    : doGroupsRequest.call(me, 'clear', data); break;
           }
        });


        // === items grid column resizing ===
        me.find('div.mgrid-header span.mgrid-column-resizer').on('mousedown', function(event) {
            var items = me.data('items');
            items.dragged_column = {
                                   column     : $(this).parent('th'),
                                  offset    : $(this).offset()['left']
            };
            me.data('items', items);
            event.preventDefault();
               new Event(event).preventDefault(); // special for IE8
            return false;
        });

        $(document).mouseup( function(event) {
            var opts = me.data('opts'),
                items = me.data('items'),
                dndColumn = me.data('items').dragged_column;

            if ( dndColumn ) {
                var items      = me.data('items'),
                    minWidth = 15,
                    maxWidth = Math.ceil( items.grid.width() - 10 ),
                    newWidth = dndColumn.column.width() - (dndColumn.offset - event.pageX);

                newWidth = (newWidth < minWidth) ? minWidth : ( (newWidth > maxWidth) ? maxWidth : newWidth );
                dndColumn.column.width( Math.ceil(newWidth) );
                items.dragged_column = false;
                me.data('items',items);
                reDraw.call(me);
            }

            if ( opts.groupped && items.dragged_item && items.dragged_item.item && items.dragged_item.group ) {
                if (items.grid.find('.mgrid-button-move').hasClass('active') ) {
                    moveItemIntoGroup.call(me, items.dragged_item.item, items.dragged_item.group );
                }
                else {
                    copyItemIntoGroup.call(me, items.dragged_item.item, items.dragged_item.group );
                }
            }
            items.dragged_item = false;
            me.data('items',items);
        });



        // === items sorting by click on column title  ===
        items.grid.find('div.mgrid-column-name').on('click', function(){
            var hColumn = $(this).parents('th').first(),
                hColumnFor = hColumn.attr('for');

             items.grid.find('div.mgrid-header table th[for!="'+hColumnFor+'"]').children('div.mgrid-column-name')
                        .removeClass('mgrid-sort-asc')
                        .removeClass('mgrid-sort-desc');

            if ( $(this).hasClass('mgrid-sort-asc') ) {
                $(this).removeClass('mgrid-sort-asc').addClass('mgrid-sort-desc');
                items.conditions.sort_column    = hColumnFor;
                items.conditions.sort_order    = 'desc';
            }
            else if ( $(this).hasClass('mgrid-sort-desc') ) {
                $(this).removeClass('mgrid-sort-desc');
                items.conditions.sort_column    = null;
                items.conditions.sort_order        = 'asc';
            }
            else {
                $(this).addClass('mgrid-sort-asc');
                items.conditions.sort_column    = hColumnFor;
                items.conditions.sort_order        = 'asc';
            }
            me.data('items',items);

            doItemsRequest.call(me, "fetch", null );
        });


        // === items filtering ===
        items.grid.find('div.mgrid-header input').on('keyup', function(event) {
            var columnName     = $(this).attr('for'),
                filterValue = $(this).val();

            // find and highlight
            items.grid.find('div.mgrid-content td[for="'+columnName+'"]').each( function(i,cell) {
                $(this).html( $(this).attr('title').replace( new RegExp( filterValue,'gi'), '<hl>'+filterValue+'</hl>' ) ) ;
            });
        });


        // === items paging by pages number selector ===
        items.grid.find('select.mgrid-pages-selector').on('change', function(event) {
            items.conditions.page = $(this).val();
            me.data('items', items);
            doItemsRequest.call(me, "fetch", null );
        });

        // === items paging by [prev] button ===
        items.grid.find(".mgrid-pages-selector-prev").on('click', function(event) {
            var pager = items.grid.find('select.mgrid-pages-selector'),
                curr = parseInt(pager.val());
            if (curr > 1) { pager.val( curr-1 ).change(); }
        });

         // === items paging by [next] button ===
        items.grid.find(".mgrid-pages-selector-next").on('click', function(event) {
            var pager = items.grid.find('select.mgrid-pages-selector'),
                pages = pager.children('option').size(),
                curr = parseInt(pager.val());
            if (curr<pages) { pager.val( curr+1 ).change(); }
        });

        // === open item popup add-window ===
        items.grid.find('.mgrid-button-add').on('click', function(event) {
            showAddItemWindow.call(me);
        });

        // ----- open item popup update-window -----
        items.grid.find('.mgrid-button-update').on('click', function(event) {
            showUpdateItemWindow.call(me);
        });

        // ----- open item popup remove-window -----
        items.grid.find('.mgrid-button-remove').on('click', function(event) {
            showRemoveItemWindow.call(me);
        });



        if (opts.groupped) {

            // === open group popup add-window ===
            groupsGrid.find('.mgrid-button-add').on('click', function(event) {
                showAddGroupWindow.call(me);
            });

            // ----- open group popup update-window -----
            groupsGrid.find('.mgrid-button-update').on('click', function(event) {
                showUpdateGroupWindow.call(me);
            });

            // ----- open group popup remove-window confirmation -----
            groupsGrid.find('.mgrid-button-remove').on('click', function(event) {
                showRemoveGroupWindow.call(me);
            });

            // ----- open group popup clear-window confirmation -----
            groupsGrid.find('.mgrid-button-clear').on('click', function(event) {
                showClearGroupWindow.call(me);
            });

            // ----- set Drag-and-Drop method for items as Move into group -----
            itemsGrid.find('.mgrid-button-move').on('click' , function(event) {
                if ( $(this).hasClass('active') ) return;
                $(this).addClass('active');
                itemsGrid.find('.mgrid-button-copy').removeClass('active');
            });

            // ----- set Drag-and-Drop method for items as Copy into group -----
            itemsGrid.find('.mgrid-button-copy').on('click' , function(event) {
                if ( $(this).hasClass('active') ) return;
                $(this).addClass('active');
                itemsGrid.find('.mgrid-button-move').removeClass('active');
            });

        } // if groupped


    };


    // ----- set events for new item in list -----
    function setEventsForItem( item ) {
        var me = this,
            opts = me.data('opts'),
            items = me.data('items'),
            groupsGrid = me.data('groups').grid;

        item.on('click', function(event) {
            var acceptable = true,
                itemsTable = $(this).parents('.mgrid-content table').first();

            if ( opts.callback.onSelect ) { acceptable = opts.callback.onSelect.call( this, item.data('raw') ); }
            if (!acceptable) { return false; }

            itemsTable.find('tbody > tr').removeClass('mgrid-selected-item');
            $(this).addClass('mgrid-selected-item');
        });

        // if groupped, observe Drag-and-Drop events
        if ( opts.groupped ) {
            item.on('mousedown', function(event) {
                   items.dragged_item = { item: $(this), group: false };
                   me.data('items',items);
                   event.preventDefault();
                new Event(event).preventDefault(); // special for IE8
                return false;
            });

            item.on('mouseenter', function(event) {
                var groups = item.data('raw')._groups;
                for(var i=0; i<groups.length; i++) {
                    showRelatedGroups.call(me, groups );
                }
            });

            item.on('mouseleave', function(event) {
                var groups = item.data('raw')._groups;
                for(var i=0; i<groups.length; i++) {
                    showRelatedGroups.call(me, false );
                }
            });
         }

    };


    function setEventsForGroup( group ) {
        var me = this,
            opts = me.data('opts'),
            items = me.data('items'),
            groupsGrids = me.data('groups').grid;

        group.on('click', function(event) {
             var acceptable = true,
                groupData = $(this).data('raw');

            if ( opts.groups.callback.onSelect ) { acceptable = opts.groups.callback.onSelect.call( me, groupData); }
            if (!acceptable) { return false; }

            groupsGrids.find('.mgrid-content > div.mgrid-group-row').removeClass('mgrid-selected-group');
               $(this).addClass('mgrid-selected-group');
              methods.fetchItems.call( me, { _group:groupData.id } );
        });


        // if item is dragged, then remember group for drop
        group.on('mouseenter', function(event) {
            if ( items.dragged_item && items.dragged_item.item ) {
                items.dragged_item.group = $(this);
                me.data('items', items);
            }
        });

        // if item is dragged, then reset group for drop
        group.on('mouseleave', function(event) {
            if ( items.dragged_item && items.dragged_item.item ) {
                items.dragged_item.group = null;
                me.data('items', items);
            }
        });

    }
















    $.fn.mGrid = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            // call method
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }
        else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // call initailization
            return methods.init.apply( this, arguments );
        }
        else {
            return false;
        }
    };


})(jQuery);