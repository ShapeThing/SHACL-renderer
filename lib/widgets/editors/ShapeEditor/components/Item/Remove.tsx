import Icon from '../../../../../components/various/Icon'

export function Remove(props: any) {
  return (
    <button className="button small" {...props}>
      <Icon icon="mynaui:trash" />
    </button>
  )
}
