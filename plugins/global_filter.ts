import { Vue } from 'nuxt-property-decorator'

declare module 'vue/types/vue' {
  interface Vue {
    $unEscapeHTML(str: string): void
  }
}

Vue.prototype.$unEscapeHTML = (str: string) =>
  str
    .replace(/(<)/g, '&lt;')
    .replace(/(>)/g, '&gt;')
    .replace(/(&amp;)/g, '&')
    .replace(/(&apos;)/g, "'")
    .replace(/(&#x27;)/g, "'")
    .replace(/(&#x2F;)/g, '/')
    .replace(/(&#39;)/g, "'")
    .replace(/(&#038;)/g, '&')
    .replace(/(&#47;)/g, '/')
    .replace(/(&lt;)/g, '<')
    .replace(/(&gt;)/g, '>')
    .replace(/(&nbsp;)/g, ' ')
    .replace(/(&#8212;)/g, '-')
    .replace(/(&#8217;)/g, '’')
    .replace(/(&#8220;)/g, '“')
    .replace(/(&#8221;)/g, '“')
    .replace(/(&#8211;)/g, '-')
    .replace(/(&yen;)/g, '¥')
    .replace(/(&copy;)/g, '©')
    .replace(/(&quot;)/g, "'")
    .replace(/(&#39;)/g, "'")
