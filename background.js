var tabAccordion = new function() {
    this.prevFocusedTab = null;

    this.constructor = function() {
        this.prevFocusedTab = opera.extension.tabs.getFocused();
        this.toggleExpansion(this.prevFocusedTab);
    }

    /**
     * Expands the group a tab belongs to, and contracts all other groups.
     * @param {tab} tab
     */
    this.toggleExpansion = function(tab) {
        var tabGroup = tab.tabGroup;
        var groups = opera.extension.tabGroups.getAll();

        groups.forEach(function(g) {
            var newState = true;
            if (tabGroup == g)
                newState = false;
            if (newState != g.collapsed)
                g.update({ collapsed: newState });
        });
    }

    /**
     * Snaps a newly created tab back to the parent it was created from.
     * @param {tab} tab
     */
    this.snapBack = function(tab) {
        var sel = opera.extension.tabs.getSelected();

        // if the selected tab is the created tab, the tab is being opened in the foreground, so use the last selected tab
        if (tab.focused)
            sel = this.prevFocusedTab;

        if (!!sel.tabGroup) {
            sel.tabGroup.insert(tab);
        }
    }

    return this.constructor();
}

opera.extension.tabs.onfocus = function(e) {
    tabAccordion.toggleExpansion(e.tab);
    tabAccordion.prevFocusedTab = e.tab;
}

opera.extension.tabs.oncreate = function(e) {
    var createMask = 1;

    if (e.tab != opera.extension.tabs.getFocused()) {
        createMask = 2;
    }

    if (widget.preferences['snapTab'] & createMask) {
        tabAccordion.snapBack(e.tab);
    }
}

opera.extension.tabs.onmove = function(e) {
    var tabMoved = e.tab;
    if (e.tab.focused) {
        tabAccordion.toggleExpansion(tabMoved);
    }
}

opera.extension.windows.onfocus = function(e) {
    var tabFocused = e.browserWindow.tabs.getFocused();
    tabAccordion.toggleExpansion(tabFocused);

    // This helps when switching windows as well as when creating new
    // windows to prevent tab in the new window from being sucked back
    // into a group from the previous window.
    tabAccordion.prevFocusedTab = tabFocused;
}

