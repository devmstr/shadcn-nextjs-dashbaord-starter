import { notFound } from 'next/navigation'

interface Props {}

const Page: React.FC<Props> = ({}: Props) => {
  return notFound()
}

export default Page
