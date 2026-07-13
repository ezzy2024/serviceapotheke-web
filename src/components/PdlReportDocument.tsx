import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Note: To use custom fonts, you would register them here via Font.register

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#333333',
  },
  headerContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0056b3',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  dateText: {
    fontSize: 10,
    color: '#999999',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    color: '#222222',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontFamily: 'Helvetica-Bold',
  },
  value: {
    flex: 1,
  },
  issueBox: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  severityHIGH: {
    color: '#d32f2f',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  severityMEDIUM: {
    color: '#f57c00',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  severityLOW: {
    color: '#fbc02d',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  descriptionText: {
    marginBottom: 5,
  },
  recommendationText: {
    fontFamily: 'Helvetica-Oblique',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: 'grey',
    fontSize: 10,
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
    paddingTop: 10,
  }
});

interface Issue {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  recommendation: string;
}

interface PdlReportDocumentProps {
  patient: {
    kdnNr?: string;
    geburt?: string;
    gender?: string;
    medicationCount?: number;
  };
  analysis: {
    summary: string;
    issues: Issue[];
  };
  date: string;
}

export const PdlReportDocument = ({ patient, analysis, date }: PdlReportDocumentProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>pDL Dokumentationsprotokoll</Text>
          <Text style={styles.subtitle}>Erweiterte Medikationsberatung bei Polymedikation (AMTS)</Text>
          <Text style={styles.subtitle}>Standardisierte Risikoerfassung hoher Blutdruck</Text>
          <Text style={styles.dateText}>Ausgestellt am: {date}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patienteninformationen</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Kunden-Nr:</Text>
            <Text style={styles.value}>{patient.kdnNr || 'Unbekannt'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Alter (Geburt):</Text>
            <Text style={styles.value}>{patient.geburt || 'Unbekannt'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Geschlecht:</Text>
            <Text style={styles.value}>{patient.gender || 'Unbekannt'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>KI-Analyse (In-Memory Evaluiert)</Text>
          <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 5 }}>Zusammenfassung:</Text>
          <Text style={{ marginBottom: 15, lineHeight: 1.4 }}>{analysis.summary}</Text>

          <Text style={{ fontFamily: 'Helvetica-Bold', marginBottom: 10 }}>Gefundene Risiken & Empfehlungen:</Text>
          
          {analysis.issues && analysis.issues.length > 0 ? (
            analysis.issues.map((issue, index) => (
              <View key={index} style={styles.issueBox}>
                <Text style={styles[`severity${issue.severity}` as keyof typeof styles] || styles.severityMEDIUM}>
                  Schweregrad: {issue.severity}
                </Text>
                <Text style={styles.descriptionText}>Problem: {issue.description}</Text>
                <Text style={styles.recommendationText}>Empfehlung: {issue.recommendation}</Text>
              </View>
            ))
          ) : (
            <Text>Keine spezifischen Risiken gefunden.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apotheker-Bestätigung</Text>
          <Text style={{ lineHeight: 1.4 }}>
            Die oben genannten Erkenntnisse wurden evaluiert und fließen in die Medikationsberatung sowie die Risikoerfassung ein. 
            Dieses Dokument wurde lokal und verschlüsselt erzeugt.
          </Text>
        </View>

        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Seite ${pageNumber} von ${totalPages} - Vertrauliche pDL Dokumentation`
        )} fixed />
      </Page>
    </Document>
  );
};
