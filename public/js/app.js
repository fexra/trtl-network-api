document.addEventListener('DOMContentLoaded', () => {

    // Navbar
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)

    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target
                const $target = document.getElementById(target)

                el.classList.toggle('is-active')
                $target.classList.toggle('is-active')
            })
        })
    }
    jQuery(function() {

        jQuery.getJSON('/data', function(nodes) {

            const markers = []
            const series = []

            nodes.forEach(function(node) {
                markers.push({
                    name: node.ip + ':' + node.port,
                    latLng: JSON.parse(node.coordinates),
                })
            })

            nodes.forEach(function(node) {

                series[node.country] = (series[node.country] || 0) + 1
            })

            console.log(series)

            jQuery('#map').vectorMap({
                map: 'world_mill',
                hoverOpacity: 0.7,
                hoverColor: true,
                markerStyle: {
                  initial: {
                    fill: '#1e5329',
                    stroke: '#59c36f'
                  }
                },
                backgroundColor: '#383f47',
                series: {
                    regions: [{
                        values: series,
                        scale: ['#7eee8f', '#007118'],
                        normalizeFunction: 'polynomial'
                      }]
                },
                markers: markers,
            })
        })
    })
})


