var tabAccordion = new function() {
    this.prevFocusedTab = null;
    this.focusedGroup = null;

    this.constructor = function() {
        this.prevFocusedTab = opera.extension.tabs.getFocused();
        this.focusedGroup = opera.extension.tabs.getFocused().tabGroup;
        this.toggleExpansion(this.focusedGroup);
    }

    this.toggleExpansion = function(tabGroup) {
        var groups = opera.extension.tabGroups.getAll();

        groups.forEach(function(g) {
            var newState = true;
            if (tabGroup == g)
                newState = false;
            if (newState != g.collapsed)
                g.update({ collapsed: newState });
        });
    }

    this.snapBack = function(tab) {
        var sel = opera.extension.tabs.getSelected();

        // if the selected tab is the created tab, the tab is being opened in the foreground, so use the last selected tab
        if (sel.id == tab.id)
            sel = this.prevFocusedTab;

        if (!!sel.tabGroup) {
            sel.tabGroup.insert(e.tab);
        }
    }

    return this.constructor();
}

opera.extension.tabs.onfocus = function(e) {
    tabAccordion.toggleExpansion(e.tab.tabGroup);
    tabAccordion.prevFocusedTab = e.tab;

    console.log(widget.preferences['snapBackTab']);
    console.log(widget.preferences.snapBackTab);
}

opera.extension.tabs.oncreate = function(e) {
    tabAccordion.snapBack(e.tab);
}

opera.extension.tabs.onmove = function(e) {
    var tabMoved = e.tab;
    if (e.tab.focused) {
        if (!!tabMoved.tagGroup) console.log(tabMoved.tabGroup.collapsed);
        tabAccordion.toggleExpansion(tabMoved.tabGroup);
        if (!!tabMoved.tagGroup) console.log(tabMoved.tabGroup.collapsed);
    }
}

opera.extension.tabs.onclose = function(e) {
    //tabClosed.tabGroup.focus();
    console.log(e);
}

//opera.extension.tabGroups.oncreate = function (e) {
//    e.tabGroup.update({collapsed : false});
//}
