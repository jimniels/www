$(document).ready(function(){

    $('body').addClass('js');

    $('.section').each(function(){
        $this = $(this);
        $this.addClass('section--condensed');
        var size = $this.find('.section__content > li').size();
        $('<p class="section__trigger"><a href="#">View All (' + size + ')</a></p>').appendTo($this);
    });


    $('.section__trigger a').on('click', function(e){
        e.preventDefault();
        var $this = $(this),
            $parent = $this.parents('.section');

        if ( $parent.hasClass('section--condensed') ) {
            $parent.removeClass('section--condensed');
            $this.remove()
        }
    });

});