import { useState, type FormEvent } from 'react'
import { Alert, Button, Card, CardBody, CardHeader, Field, Input, Select, Switch } from '@/design-system'
import { ViewHeader } from './GenesView'

export function SettingsView() {
  const [name, setName] = useState('Okafor Lab')
  const [fdr, setFdr] = useState('0.05')
  const [notify, setNotify] = useState(true)
  const [share, setShare] = useState(false)
  const [saved, setSaved] = useState(false)
  const [touched, setTouched] = useState(false)

  const nameError = !name.trim() ? 'Workspace name is required' : name.length > 40 ? 'Keep it under 40 characters' : undefined
  const fdrNum = Number(fdr)
  const fdrError = Number.isNaN(fdrNum) || fdrNum <= 0 || fdrNum >= 1 ? 'Enter a value between 0 and 1, e.g. 0.05' : undefined

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (nameError || fdrError) return setSaved(false)
    setSaved(true)
  }

  return (
    <div className="max-w-2xl space-y-5">
      <ViewHeader title="Workspace settings" description="Defaults that apply to every new analysis in this workspace." />
      <Card>
        <CardHeader title="General" />
        <CardBody>
          <form noValidate onSubmit={onSubmit} className="space-y-4">
            <Field label="Workspace name" error={touched ? nameError : undefined}>
              <Input value={name} onChange={(e) => (setName(e.target.value), setSaved(false))} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Default FDR cutoff" hint="Used for adjusted p-values" error={touched ? fdrError : undefined}>
                <Input inputMode="decimal" value={fdr} onChange={(e) => (setFdr(e.target.value), setSaved(false))} />
              </Field>
              <Field label="Normalization">
                <Select defaultValue="median-ratio">
                  <option value="median-ratio">Median of ratios</option>
                  <option value="tmm">TMM</option>
                  <option value="cpm">CPM</option>
                </Select>
              </Field>
            </div>
            <Field label="Reference genome" hint="Locked after the first dataset is aligned">
              <Input value="GRCh38 · release 110" disabled readOnly />
            </Field>
            <div className="space-y-3 border-t border-border pt-4">
              <Switch
                label="Email me when a run finishes"
                description="Includes failures and the step that failed."
                checked={notify}
                onChange={setNotify}
              />
              <Switch
                label="Allow public report links"
                description="Requires an admin to enable sharing for the lab."
                checked={share}
                onChange={setShare}
                disabled
              />
            </div>
            {saved && (
              <Alert tone="success" title="Settings saved" live>
                New analyses will use these defaults.
              </Alert>
            )}
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setName('Okafor Lab')
                  setFdr('0.05')
                  setTouched(false)
                  setSaved(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
