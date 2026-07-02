import L from 'leaflet'

function createDotIcon(color) {
  return L.divIcon({
    className: 'border-none bg-transparent',
    html: `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.25);"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

export const riderIcon = createDotIcon('#4f46e5')
export const driverIcon = createDotIcon('#16a34a')
