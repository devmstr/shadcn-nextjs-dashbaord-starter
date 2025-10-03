import { ContentSection } from '../_components/content-section'
import { AccountForm } from './account-form'

export default function Page() {
  return (
    <ContentSection
      title="Account"
      desc="Update your account settings. Set your preferred language and
          timezone."
    >
      <AccountForm />
    </ContentSection>
  )
}
