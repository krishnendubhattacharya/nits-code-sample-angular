/**
 * Created by nits on 2016-03-17.
 */

app.directive('datatableDirective', function() {
    console.log('asdsa');
    return {
        // angular passes the element reference to you
        compile: function(element) {
            $(element).DataTable();
        }
    }
});
