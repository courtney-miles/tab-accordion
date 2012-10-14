var lastSelected;

opera.extension.tabs.onfocus = function(e) {
  var groups = opera.extension.tabGroups.getAll();
  var selected = opera.extension.tabs.getSelected().tabGroup;
  groups.forEach(function(g) {
      var newState = true;
      if (selected == g)
          newState = false;
      if (newState != g.collapsed)
          g.update({ collapsed: newState });
  });
  
  lastSelected = opera.extension.tabs.getSelected();
}

opera.extension.tabs.oncreate = function(e) {
    var sel = opera.extension.tabs.getSelected();

    // if the selected tab is the created tab, the tab is being opened in the foreground, so use the last selected tab
    if (sel.id == e.tab.id)
        sel = lastSelected; // lastSelected would need to be maintained elsewhere

    try {
        sel.tabGroup.insert(e.tab);
    } catch (f) {}
}
