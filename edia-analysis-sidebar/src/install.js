import registerEditorSidebarTab from 'fontoxml-editor/src/registerEditorSidebarTab.js';
import t from 'fontoxml-localization/src/t.js';
import EdiaAnalysisSidebar from './EdiaAnalysisSidebar.jsx';

export default function install() {
  registerEditorSidebarTab({
    id: 'edia',
    icon: 'globe',
    label: t('SMART Content'),
    size: 'm',
    tooltipContent: t('EDIA SMART Content Analysis'),
    Component: EdiaAnalysisSidebar,
    priority: 0
  });
}
