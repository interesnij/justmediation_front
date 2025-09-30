interface IProps {
  title: string
  id: string
}

export const filterData: IProps[] = [
  {
    title: "All",
    id: "",
  },
  {
    title: "No Replies",
    id: "comment_count",
  }
];

export const sortData: IProps[] = [
  {
    title: "Most Recent",
    id: "-created",
  },
  {
    title: "Replies (most to least)",
    id: "-comment_count",
  },
  {
    title: "Replies (least to most)",
    id: "comment_count",
  },
  {
    title: "Most Followers",
    id: "-followers__count",
  }
];