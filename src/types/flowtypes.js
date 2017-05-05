// Global types

export type CategoryTabProps = {
  activePattern: RegExp|void,
  label: string,
  source: string,
  to: string,
}

export type EditorialProps = {
  editorialId: string,
  editorial: {
    id: string,
    kind: string,
    subtitle: string,
    title: string,
    postId: string,
  },
  postPath?: string,
  isPostLoved: boolean,
}

