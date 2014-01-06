// The base controller from which all puppets extend
// This ties all of the pieces of the puppet together, and communicates with the outside world
// via the application's wreqr

(function() {

  var Region = Marionette.Region.extend({

    constructor: function( options ){

      // Call the parent's constructor function
      Marionette.Region.prototype.constructor.apply(this, Array.prototype.slice(arguments));

    },

    _trigger: function( type ) {
      this.vent.trigger( 'region:'+type );
    },

    open: function(view){

      // Make sure the events are attached to the view
      view.delegateEvents();
      if ( this.transition === 'fade' ) {
        this.slide( this.$el, 'in', view );
      } else if ( this.transition === 'slide' ) {
        this.fade( this.$el, 'in', view );
      } else {
        this.pop( this.$el, 'in', view );
      }
      
    },

    closeView: function( view ) {
      if (view.close) { view.close(); }
      else if (view.remove) { view.remove(); }
      this._trigger( 'close' );
      Marionette.triggerMethod.call(this, "close");
      delete this.currentView;
    },

    slide: function( $el, type, view ) {

      var self = this;

      if ( type === 'in' ) {
        self._trigger( 'open' );
        $el.hide();
        $el.html( view.el );
        $el.slideDown( self.duration, function() {
          self._trigger( 'ready' );
        });
      }
      else {
        self._trigger( 'closing' );
        $el.slideUp( self.duration, function() {
          _.bind(self.closeView, self, view)();
        });
      }
      
    },

    fade: function( $el, type, view ) {

      var self = this;
      if ( type === 'in' ) {
        $el.hide();
        $el.html( view.el );
        var self = this;
        self._trigger( 'open' );
        $el.fadeIn( self.duration, function() {
          self._trigger( 'ready' );
        });
      } else {
        self._trigger( 'closing' );
        $el.fadeOut( self.duration, function() {
          _.bind(self.closeView, self, view)();
        });

      }

    },

    pop: function( $el, type, view ) {

      if ( type === 'in' ) {
        this._trigger( 'open' );
        $el.empty().append(view.el);
        this._trigger( 'ready' );
      }
      else {
        this._trigger( 'closing' );
        $el.empty();
        _.bind(this.closeView, this, view)();
      }

    },

    // Slide the element up before removing the `view`
    close: function( vent ) {
      var view = this.currentView;
      var self = this;
      if (!view || view.isClosed){ return; }

      if ( this.transition === 'fade' ) {
        this.slide( this.$el, 'out', view );
      } else if ( this.transition === 'slide' ) {
        this.fade( this.$el, 'out', view );
      } else {
        this.pop( this.$el, 'out', view );
      }
      
    } 

  });

  window.Puppets = window.Puppets || {};
  window.Puppets.Region = Region;

})();