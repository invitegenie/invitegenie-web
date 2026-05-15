export function alignObjects(items, selectedIds, alignment) {
  const selected = items.filter(i => selectedIds.includes(i.id));
  if (selected.length < 2) return items;

  const bounds = {
    minX: Math.min(...selected.map(i => i.x)),
    maxX: Math.max(...selected.map(i => i.x + i.width)),
    minY: Math.min(...selected.map(i => i.y)),
    maxY: Math.max(...selected.map(i => i.y + i.height)),
  };

  return items.map(item => {
    if (!selectedIds.includes(item.id)) return item;
    
    let newX = item.x;
    let newY = item.y;

    switch (alignment) {
      case 'left': newX = bounds.minX; break;
      case 'right': newX = bounds.maxX - item.width; break;
      case 'center': newX = bounds.minX + (bounds.maxX - bounds.minX) / 2 - item.width / 2; break;
      case 'top': newY = bounds.minY; break;
      case 'bottom': newY = bounds.maxY - item.height; break;
      case 'middle': newY = bounds.minY + (bounds.maxY - bounds.minY) / 2 - item.height / 2; break;
      default: break;
    }
    return { ...item, x: newX, y: newY };
  });
}

export function distributeObjects(items, selectedIds, axis) {
  const selected = items.filter(i => selectedIds.includes(i.id));
  if (selected.length < 3) return items;

  // Sort items by axis
  selected.sort((a, b) => axis === 'horizontal' ? a.x - b.x : a.y - b.y);
  
  const first = selected[0];
  const last = selected[selected.length - 1];
  
  if (axis === 'horizontal') {
    const totalSpace = last.x - first.x;
    const step = totalSpace / (selected.length - 1);
    selected.forEach((item, index) => { item.x = first.x + (step * index); });
  } else {
    const totalSpace = last.y - first.y;
    const step = totalSpace / (selected.length - 1);
    selected.forEach((item, index) => { item.y = first.y + (step * index); });
  }

  return items.map(item => {
    const updated = selected.find(s => s.id === item.id);
    return updated ? updated : item;
  });
}

export function groupObjects(items, selectedIds) {
  if (selectedIds.length < 2) return items;
  const groupId = `grp-${Date.now()}`;
  return items.map(item => 
    selectedIds.includes(item.id) ? { ...item, groupId } : item
  );
}

export function ungroupObjects(items, selectedIds) {
  return items.map(item => 
    selectedIds.includes(item.id) ? { ...item, groupId: null } : item
  );
}

export function getSelectionBounds(items, selectedIds) {
  const selected = items.filter(i => selectedIds.includes(i.id));
  if (!selected.length) return null;
  
  const minX = Math.min(...selected.map(i => i.x));
  const maxX = Math.max(...selected.map(i => i.x + i.width));
  const minY = Math.min(...selected.map(i => i.y));
  const maxY = Math.max(...selected.map(i => i.y + i.height));
  
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function checkMarqueeIntersection(item, marquee) {
  const ix = item.x, iy = item.y, iw = item.width, ih = item.height;
  const mx = marquee.x, my = marquee.y, mw = marquee.width, mh = marquee.height;
  
  return (
    ix < mx + mw &&
    ix + iw > mx &&
    iy < my + mh &&
    iy + ih > my
  );
}