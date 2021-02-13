import axios from 'axios'

export class WpApi {
  // 最新記事取得
  downloadLatestPage() {
    return axios
      .get(`${process.env.REST_API_URL}/wp/v2/posts`, {
        params: {
          per_page: 6,
          _fields: 'id,title,featured_media,better_featured_image,date'
        }
      })
      .then((json) => {
        return json.data
      })
      .catch((e) => {
        throw e
      })
  }

  // 投稿記事取得
  downloadSinglePage(id) {
    return axios
      .get(`${process.env.REST_API_URL}/wp/v2/posts/${id}`, {
        params: {
          _fields:
            'title,content,featured_media,better_featured_image,acf,date,author'
        }
      })
      .then((json) => {
        return json.data
      })
      .catch((e) => {
        throw e
      })
  }

  // 固定ページ取得
  downloadPage(id) {
    return axios
      .get(`${process.env.REST_API_URL}/wp/v2/pages/${id}`)
      .then((json) => {
        return json.data
      })
      .catch((e) => {
        throw e
      })
  }

  // 著者情報取得
  downloadAuthor(id) {
    return axios
      .get(`${process.env.REST_API_URL}/wp/v2/posts/?author=${id}`, {
        params: {
          _fields: 'id,title,featured_media,better_featured_image'
        }
      })
      .then((json) => {
        return json.data
      })
      .catch((e) => {
        throw e
      })
  }

  // ユーザー情報取得
  downloadUser(id) {
    return axios
      .get(`${process.env.REST_API_URL}/wp/v2/users/${id}`, {
        params: {
          _fields: 'acf,url, name'
        }
      })
      .then((json) => {
        return json.data
      })
      .catch((e) => {
        throw e
      })
  }

  // geneate用関数
  generateArticles() {
    return axios
      .get(`${process.env.REST_API_URL}/wp/v2/posts`, {
        params: {
          per_page: 99,
          _fields: 'id'
        }
      })
      .then((json) => {
        return json.data
      })
      .catch((e) => {
        throw e
      })
  }
}

const wp = new WpApi()
export default wp
