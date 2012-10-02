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
  
  lastSelected = selected;
}

opera.extension.tabs.oncreate = function(e) {
    var sel = opera.extension.tabs.getSelected();
    window.opera.postError(sel.id);
    window.opera.postError(lastSelected.id);
    window.opera.postError(e.tab.id);
    // if the selected tab is the created tab, the tab is being opened in the foreground, so use the last selected tab
    if (sel.id == e.tab.id)
        sel = lastSelected; // lastSelected would need to be maintained elsewhere
    if (sel.tabGroup)
        sel.tabGroup.insert(e.tab);
}
