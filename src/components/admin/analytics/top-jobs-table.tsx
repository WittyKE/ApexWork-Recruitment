import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getTopJobsByApplications } from "@/lib/admin/analytics";

export function TopJobsTable() {
  const jobs = getTopJobsByApplications(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top-Performing Jobs</CardTitle>
        <CardDescription>Ranked by number of applications received</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Employer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Applications</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.title}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell className="text-muted-foreground">{job.employer}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{job.category}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">{job.applications}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
