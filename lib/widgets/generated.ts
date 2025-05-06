import { lazy } from 'react'
import TextFieldWithLangEditor from './editors/TextFieldWithLangEditor/meta'
import EditorJsEditor from './editors/EditorJsEditor/meta'
import TextFieldEditor from './editors/TextFieldEditor/meta'
import IconifyEditor from './editors/IconifyEditor/meta'
import AutoCompleteEditor from './editors/AutoCompleteEditor/meta'
import ColorEditor from './editors/ColorEditor/meta'
import URIEditor from './editors/URIEditor/meta'
import DetailsEditor from './editors/DetailsEditor/meta'
import ShapeEditor from './editors/ShapeEditor/meta'
import BooleanSelectEditor from './editors/BooleanSelectEditor/meta'
import FileUploadEditor from './editors/FileUploadEditor/meta'
import NumberFieldEditor from './editors/NumberFieldEditor/meta'
import EnumSelectEditor from './editors/EnumSelectEditor/meta'
import DatePickerEditor from './editors/DatePickerEditor/meta'
import CountFacet from './facets/CountFacet/meta'
import TextFieldFacet from './facets/TextFieldFacet/meta'
import DateFacet from './facets/DateFacet/meta'
import CommaList from './lists/CommaList/meta'
import UnorderedList from './lists/UnorderedList/meta'
import NaturalLanguageList from './lists/NaturalLanguageList/meta'
import DetailsViewer from './viewers/DetailsViewer/meta'
import ColorViewer from './viewers/ColorViewer/meta'
import ImageViewer from './viewers/ImageViewer/meta'
import LabelViewer from './viewers/LabelViewer/meta'
import IconifyViewer from './viewers/IconifyViewer/meta'
import URIViewer from './viewers/URIViewer/meta'
import LiteralViewer from './viewers/LiteralViewer/meta'


export const coreWidgetMetaItems = {
  './editors/TextFieldWithLangEditor/meta.ts': TextFieldWithLangEditor,
  './editors/EditorJsEditor/meta.ts': EditorJsEditor,
  './editors/TextFieldEditor/meta.ts': TextFieldEditor,
  './editors/IconifyEditor/meta.ts': IconifyEditor,
  './editors/AutoCompleteEditor/meta.ts': AutoCompleteEditor,
  './editors/ColorEditor/meta.ts': ColorEditor,
  './editors/URIEditor/meta.ts': URIEditor,
  './editors/DetailsEditor/meta.ts': DetailsEditor,
  './editors/ShapeEditor/meta.ts': ShapeEditor,
  './editors/BooleanSelectEditor/meta.ts': BooleanSelectEditor,
  './editors/FileUploadEditor/meta.ts': FileUploadEditor,
  './editors/NumberFieldEditor/meta.ts': NumberFieldEditor,
  './editors/EnumSelectEditor/meta.ts': EnumSelectEditor,
  './editors/DatePickerEditor/meta.ts': DatePickerEditor,
  './facets/CountFacet/meta.ts': CountFacet,
  './facets/TextFieldFacet/meta.ts': TextFieldFacet,
  './facets/DateFacet/meta.ts': DateFacet,
  './lists/CommaList/meta.ts': CommaList,
  './lists/UnorderedList/meta.ts': UnorderedList,
  './lists/NaturalLanguageList/meta.ts': NaturalLanguageList,
  './viewers/DetailsViewer/meta.ts': DetailsViewer,
  './viewers/ColorViewer/meta.ts': ColorViewer,
  './viewers/ImageViewer/meta.ts': ImageViewer,
  './viewers/LabelViewer/meta.ts': LabelViewer,
  './viewers/IconifyViewer/meta.ts': IconifyViewer,
  './viewers/URIViewer/meta.ts': URIViewer,
  './viewers/LiteralViewer/meta.ts': LiteralViewer,
}

export const coreWidgetComponents = {
  './editors/TextFieldWithLangEditor/index.tsx': lazy(() => import('./editors/TextFieldWithLangEditor/index')),
  './editors/EditorJsEditor/index.tsx': lazy(() => import('./editors/EditorJsEditor/index')),
  './editors/TextFieldEditor/index.tsx': lazy(() => import('./editors/TextFieldEditor/index')),
  './editors/IconifyEditor/index.tsx': lazy(() => import('./editors/IconifyEditor/index')),
  './editors/AutoCompleteEditor/index.tsx': lazy(() => import('./editors/AutoCompleteEditor/index')),
  './editors/ColorEditor/index.tsx': lazy(() => import('./editors/ColorEditor/index')),
  './editors/URIEditor/index.tsx': lazy(() => import('./editors/URIEditor/index')),
  './editors/DetailsEditor/index.tsx': lazy(() => import('./editors/DetailsEditor/index')),
  './editors/ShapeEditor/index.tsx': lazy(() => import('./editors/ShapeEditor/index')),
  './editors/BooleanSelectEditor/index.tsx': lazy(() => import('./editors/BooleanSelectEditor/index')),
  './editors/FileUploadEditor/index.tsx': lazy(() => import('./editors/FileUploadEditor/index')),
  './editors/NumberFieldEditor/index.tsx': lazy(() => import('./editors/NumberFieldEditor/index')),
  './editors/EnumSelectEditor/index.tsx': lazy(() => import('./editors/EnumSelectEditor/index')),
  './editors/DatePickerEditor/index.tsx': lazy(() => import('./editors/DatePickerEditor/index')),
  './facets/CountFacet/index.tsx': lazy(() => import('./facets/CountFacet/index')),
  './facets/TextFieldFacet/index.tsx': lazy(() => import('./facets/TextFieldFacet/index')),
  './facets/DateFacet/index.tsx': lazy(() => import('./facets/DateFacet/index')),
  './lists/CommaList/index.tsx': lazy(() => import('./lists/CommaList/index')),
  './lists/UnorderedList/index.tsx': lazy(() => import('./lists/UnorderedList/index')),
  './lists/NaturalLanguageList/index.tsx': lazy(() => import('./lists/NaturalLanguageList/index')),
  './viewers/DetailsViewer/index.tsx': lazy(() => import('./viewers/DetailsViewer/index')),
  './viewers/ColorViewer/index.tsx': lazy(() => import('./viewers/ColorViewer/index')),
  './viewers/ImageViewer/index.tsx': lazy(() => import('./viewers/ImageViewer/index')),
  './viewers/LabelViewer/index.tsx': lazy(() => import('./viewers/LabelViewer/index')),
  './viewers/IconifyViewer/index.tsx': lazy(() => import('./viewers/IconifyViewer/index')),
  './viewers/URIViewer/index.tsx': lazy(() => import('./viewers/URIViewer/index')),
  './viewers/LiteralViewer/index.tsx': lazy(() => import('./viewers/LiteralViewer/index')),
}

