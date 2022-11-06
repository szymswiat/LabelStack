from typing import List


ALL_SOP_CLASSES: List[str] = [
    "1.2.840.10008.1.20.1",  # Storage Commitment Push Model SOP Class
    "1.2.840.10008.1.3.10",  # Media Storage Directory Storage
    "1.2.840.10008.4.2",  # Storage Service Class
    "1.2.840.10008.5.1.4.1.1.1",  # CR Image Storage
    "1.2.840.10008.5.1.4.1.1.1.1",  # Digital X-Ray Image Storage â€“ for Presentation
    "1.2.840.10008.5.1.4.1.1.1.1.1",  # Digital X-Ray Image Storage â€“ for Processing
    "1.2.840.10008.5.1.4.1.1.1.2",  # Digital Mammography X-Ray Image Storage â€“ for Presentation
    "1.2.840.10008.5.1.4.1.1.1.2.1",  # Digital Mammography X-Ray Image Storage â€“ for Processing
    "1.2.840.10008.5.1.4.1.1.1.3",  # Digital Intra â€“ oral X-Ray Image Storage â€“ for Presentation
    "1.2.840.10008.5.1.4.1.1.1.3.1",  # Digital Intra â€“ oral X-Ray Image Storage â€“ for Processing
    "1.2.840.10008.5.1.4.1.1.104.1",  # Encapsulated PDF Storage
    "1.2.840.10008.5.1.4.1.1.11.1",  # Grayscale Softcopy Presentation State Storage SOP Class
    "1.2.840.10008.5.1.4.1.1.11.2",  # Color Softcopy Presentation State Storage SOP Class
    "1.2.840.10008.5.1.4.1.1.11.3",  # Pseudocolor Softcopy Presentation Stage Storage SOP Class
    "1.2.840.10008.5.1.4.1.1.11.4",  # Blending Softcopy Presentation State Storage SOP Class
    "1.2.840.10008.5.1.4.1.1.12.1",  # X-Ray Angiographic Image Storage
    "1.2.840.10008.5.1.4.1.1.12.1.1",  # Enhanced XA Image Storage
    "1.2.840.10008.5.1.4.1.1.12.2",  # X-Ray Radiofluoroscopic Image Storage
    "1.2.840.10008.5.1.4.1.1.12.2.1",  # Enhanced XRF Image Storage
    "1.2.840.10008.5.1.4.1.1.2",  # CT Image Storage
    "1.2.840.10008.5.1.4.1.1.2.1",  # Enhanced CT Image Storage
    "1.2.840.10008.5.1.4.1.1.20",  # NM Image Storage
    "1.2.840.10008.5.1.4.1.1.3.1",  # Ultrasound Multiframe Image Storage
    "1.2.840.10008.5.1.4.1.1.4",  # MR Image Storage
    "1.2.840.10008.5.1.4.1.1.4.1",  # Enhanced MR Image Storage
    "1.2.840.10008.5.1.4.1.1.4.2",  # MR Spectroscopy Storage
    "1.2.840.10008.5.1.4.1.1.481.1",  # Radiation Therapy Image Storage
    "1.2.840.10008.5.1.4.1.1.481.2",  # Radiation Therapy Dose Storage
    "1.2.840.10008.5.1.4.1.1.481.3",  # Radiation Therapy Structure Set Storage
    "1.2.840.10008.5.1.4.1.1.481.4",  # Radiation Therapy Beams Treatment Record Storage
    "1.2.840.10008.5.1.4.1.1.481.5",  # Radiation Therapy Plan Storage
    "1.2.840.10008.5.1.4.1.1.481.6",  # Radiation Therapy Brachy Treatment Record Storage
    "1.2.840.10008.5.1.4.1.1.481.7",  # Radiation Therapy Treatment Summary Record Storage
    "1.2.840.10008.5.1.4.1.1.481.8",  # Radiation Therapy Ion Plan Storage
    "1.2.840.10008.5.1.4.1.1.481.9",  # Radiation Therapy Ion Beams Treatment Record Storage
    "1.2.840.10008.5.1.4.1.1.6.1",  # Ultrasound Image Storage
    "1.2.840.10008.5.1.4.1.1.66",  # Raw Data Storage
    "1.2.840.10008.5.1.4.1.1.66.1",  # Spatial Registration Storage
    "1.2.840.10008.5.1.4.1.1.66.2",  # Spatial Fiducials Storage
    "1.2.840.10008.5.1.4.1.1.66.3",  # Deformable Spatial Registration Storage
    "1.2.840.10008.5.1.4.1.1.66.4",  # Segmentation Storage
    "1.2.840.10008.5.1.4.1.1.67",  # Real World Value Mapping Storage
    "1.2.840.10008.5.1.4.1.1.7",  # Secondary Capture Image Storage
    "1.2.840.10008.5.1.4.1.1.7.1",  # Multiframe Single Bit Secondary Capture Image Storage
    "1.2.840.10008.5.1.4.1.1.7.2",  # Multiframe Grayscale Byte Secondary Capture Image Storage
    "1.2.840.10008.5.1.4.1.1.7.3",  # Multiframe Grayscale Word Secondary Capture Image Storage
    "1.2.840.10008.5.1.4.1.1.7.4",  # Multiframe True Color Secondary Capture Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.1",  # VL endoscopic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.1.1",  # Video Endoscopic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.2",  # VL Microscopic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.2.1",  # Video Microscopic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.3",  # VL Slide-Coordinates Microscopic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.4",  # VL Photographic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.4.1",  # Video Photographic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.5.1",  # Ophthalmic Photography 8-Bit Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.5.2",  # Ophthalmic Photography 16-Bit Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.5.3",  # Stereometric Relationship Storage
    "1.2.840.10008.5.1.4.1.1.88.40",  # Procedure Log Storage
    "1.2.840.10008.5.1.4.1.1.9.1.1",  # 12-lead ECG Waveform Storage
    "1.2.840.10008.5.1.4.1.1.9.1.2",  # General ECG Waveform Storage
    "1.2.840.10008.5.1.4.1.1.9.1.3",  # Ambulatory ECG Waveform Storage
    "1.2.840.10008.5.1.4.1.1.9.2.1",  # Hemodynamic Waveform Storage
    "1.2.840.10008.5.1.4.1.1.9.3.1",  # Cardiac Electrophysiology Waveform Storage
    "1.2.840.10008.5.1.4.1.1.9.4.1",  # Basic Voice Audio Waveform Storage
    "1.2.840.10008.5.1.4.38.1",  # Hanging Protocol Storage
]


IMAGING_SOP_CLASSES: List[str] = [
    "1.2.840.10008.5.1.4.1.1.1",  # CR Image Storage
    "1.2.840.10008.5.1.4.1.1.1.1",  # Digital X-Ray Image Storage â€“ for Presentation
    "1.2.840.10008.5.1.4.1.1.1.1.1",  # Digital X-Ray Image Storage â€“ for Processing
    "1.2.840.10008.5.1.4.1.1.1.2",  # Digital Mammography X-Ray Image Storage â€“ for Presentation
    "1.2.840.10008.5.1.4.1.1.1.2.1",  # Digital Mammography X-Ray Image Storage â€“ for Processing
    "1.2.840.10008.5.1.4.1.1.1.3",  # Digital Intra â€“ oral X-Ray Image Storage â€“ for Presentation
    "1.2.840.10008.5.1.4.1.1.1.3.1",  # Digital Intra â€“ oral X-Ray Image Storage â€“ for Processing
    "1.2.840.10008.5.1.4.1.1.11.1",  # Grayscale Softcopy Presentation State Storage SOP Class
    "1.2.840.10008.5.1.4.1.1.11.2",  # Color Softcopy Presentation State Storage SOP Class
    "1.2.840.10008.5.1.4.1.1.11.3",  # Pseudocolor Softcopy Presentation Stage Storage SOP Class
    "1.2.840.10008.5.1.4.1.1.11.4",  # Blending Softcopy Presentation State Storage SOP Class
    "1.2.840.10008.5.1.4.1.1.12.1",  # X-Ray Angiographic Image Storage
    "1.2.840.10008.5.1.4.1.1.12.1.1",  # Enhanced XA Image Storage
    "1.2.840.10008.5.1.4.1.1.12.2",  # X-Ray Radiofluoroscopic Image Storage
    "1.2.840.10008.5.1.4.1.1.12.2.1",  # Enhanced XRF Image Storage
    "1.2.840.10008.5.1.4.1.1.2",  # CT Image Storage
    "1.2.840.10008.5.1.4.1.1.2.1",  # Enhanced CT Image Storage
    "1.2.840.10008.5.1.4.1.1.20",  # NM Image Storage
    "1.2.840.10008.5.1.4.1.1.3.1",  # Ultrasound Multiframe Image Storage
    "1.2.840.10008.5.1.4.1.1.4",  # MR Image Storage
    "1.2.840.10008.5.1.4.1.1.4.1",  # Enhanced MR Image Storage
    "1.2.840.10008.5.1.4.1.1.4.2",  # MR Spectroscopy Storage
    "1.2.840.10008.5.1.4.1.1.481.1",  # Radiation Therapy Image Storage
    "1.2.840.10008.5.1.4.1.1.6.1",  # Ultrasound Image Storage
    "1.2.840.10008.5.1.4.1.1.66",  # Raw Data Storage
    "1.2.840.10008.5.1.4.1.1.7.1",  # Multiframe Single Bit Secondary Capture Image Storage
    "1.2.840.10008.5.1.4.1.1.7.2",  # Multiframe Grayscale Byte Secondary Capture Image Storage
    "1.2.840.10008.5.1.4.1.1.7.3",  # Multiframe Grayscale Word Secondary Capture Image Storage
    "1.2.840.10008.5.1.4.1.1.7.4",  # Multiframe True Color Secondary Capture Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.1",  # VL endoscopic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.1.1",  # Video Endoscopic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.2",  # VL Microscopic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.2.1",  # Video Microscopic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.3",  # VL Slide-Coordinates Microscopic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.4",  # VL Photographic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.4.1",  # Video Photographic Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.5.1",  # Ophthalmic Photography 8-Bit Image Storage
    "1.2.840.10008.5.1.4.1.1.77.1.5.2",  # Ophthalmic Photography 16-Bit Image Storage
]
